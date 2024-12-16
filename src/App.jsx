import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SkillsGlobe from './components/SkillsGlobe';

const StyledHero = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    color: #E2E8F0;
`;

const StyledContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
`;

const App = () => {
    return (
        <>
            <StyledHero>
                <StyledContainer>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Hi, I'm <span style={{ color: '#6366F1' }}>John Doe</span></h1>
                        <p>Full Stack Developer passionate about creating beautiful and functional web applications</p>
                    </motion.div>
                </StyledContainer>
            </StyledHero>
            
            <section style={{ height: '100vh', background: '#1E293B' }}>
                <h2 style={{ textAlign: 'center', padding: '2rem', color: '#E2E8F0' }}>My Skills</h2>
                <SkillsGlobe />
            </section>
        </>
    );
};

export default App; 