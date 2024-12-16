import os
import boto3
from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
from bson import ObjectId
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

app = Flask(__name__)

# MongoDB configuration
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
mongo_client = MongoClient(app.config['MONGO_URI'], server_api={'version': '1'})
mongo_db = mongo_client['blogs']

# AWS S3 configuration
S3_BUCKET = os.getenv('S3_BUCKET')
AWS_ACCESS_KEY = os.getenv('AKIAUBHBIHM2XJAADZXB')
AWS_SECRET_KEY = os.getenv('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')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

# Upload image to S3 and store path in MongoDB
@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        image = request.files['image']
        image_name = image.filename

        # Upload image to S3
        s3_client.upload_fileobj(image, S3_BUCKET, image_name)
        s3_path = f"https://{S3_BUCKET}.s3.amazonaws.com/{image_name}"

        # Store path in MongoDB
        image_doc = {"image_name": image_name, "s3_path": s3_path}
        result = mongo_db.blogs_lists.insert_one(image_doc)

        return jsonify({"message": "Image uploaded successfully", "id": str(result.inserted_id)}), 201

    except (NoCredentialsError, PartialCredentialsError):
        return jsonify({"error": "AWS credentials are missing or incorrect."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Retrieve all images and their paths from MongoDB
@app.route('/images', methods=['GET'])
def get_images():
    try:
        images = list(mongo_db.blogs_lists.find())
        for image in images:
            image['_id'] = str(image['_id'])

        return jsonify(images), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Retrieve and display a specific image from S3
@app.route('/image/<image_id>', methods=['GET'])
def get_image(image_id):
    try:
        image_doc = mongo_db.blogs_lists.find_one({"_id": ObjectId(image_id)})
        if not image_doc:
            return jsonify({"error": "Image not found in database."}), 404

        s3_path = image_doc['s3_path']
        image_name = image_doc['image_name']

        # Download the image from S3
        s3_client.download_file(S3_BUCKET, image_name, image_name)

        return send_file(image_name, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete image from S3 and MongoDB
@app.route('/image/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    try:
        image_doc = mongo_db.blogs_lists.find_one({"_id": ObjectId(image_id)})
        if not image_doc:
            return jsonify({"error": "Image not found in database."}), 404

        image_name = image_doc['image_name']

        # Delete from S3
        s3_client.delete_object(Bucket=S3_BUCKET, Key=image_name)

        # Delete from MongoDB
        mongo_db.blogs_lists.delete_one({"_id": ObjectId(image_id)})

        return jsonify({"message": "Image deleted successfully."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
