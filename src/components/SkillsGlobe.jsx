import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
    { name: 'React', color: '#61DAFB' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'Python', color: '#3776AB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'HTML5', color: '#E34F26' },
    { name: 'CSS3', color: '#1572B6' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'SQL', color: '#4479A1' },
    { name: 'Git', color: '#F05032' },
    { name: 'Docker', color: '#2496ED' },
];

function SkillNode({ position, skill }) {
    const textRef = useRef();

    useFrame(({ clock }) => {
        textRef.current.lookAt(0, 0, 0);
        textRef.current.position.y += Math.sin(clock.getElapsedTime() + position[0]) * 0.001;
    });

    return (
        <Text
            ref={textRef}
            position={position}
            color={skill.color}
            fontSize={0.5}
            maxWidth={2}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
            anchorX="center"
            anchorY="middle"
        >
            {skill.name}
        </Text>
    );
}

function SkillsGlobe() {
    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enableZoom={false} />
                {skills.map((skill, i) => {
                    const phi = Math.acos(-1 + (2 * i) / skills.length);
                    const theta = Math.sqrt(skills.length * Math.PI) * phi;
                    const position = [
                        4 * Math.cos(theta) * Math.sin(phi),
                        4 * Math.sin(theta) * Math.sin(phi),
                        4 * Math.cos(phi),
                    ];
                    return <SkillNode key={skill.name} position={position} skill={skill} />;
                })}
            </Canvas>
        </div>
    );
}

export default SkillsGlobe; 