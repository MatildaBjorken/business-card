import React, { useRef, useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import { Canvas, useFrame } from 'react-three-fiber';
import { softShadows, MeshWobbleMaterial, OrbitControls } from 'drei';
import './App.scss';
import { useSpring, a } from 'react-spring/three';
import Header from './components/header'
import Text from './components/text'
// soft Shadows
softShadows();

const SpinningMesh = ({ position, color, speed, args }) => {
  //ref to target the mesh
  const mesh = useRef();

  //useFrame allows us to re-render/update rotation on each frame
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  //Basic expand state
  const [expand, setExpand] = useState(false);
  // React spring expand animation
  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  return (
    <a.mesh
      position={position}
      ref={mesh}
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={args} />
      <MeshWobbleMaterial
        color={color}
        speed={speed}
        attach="material"
        factor={0.6}
      />
    </a.mesh>
  );
};

const App = () => {

  return (
    <>
      {/* Our Scene & Camera is already built into our canvas */}
      <div className="canvas-wrapper">
        <Header/>
        <Canvas
          id="canvas"
          height="100px"
          colorManagement
          shadowMap
          camera={{ position: [-5, 3, 10], fov: 60 }}
        >
          {/* This light makes things look pretty */}
          <ambientLight intensity={0.2} />
          {/* Our main source of light, also casting our shadow */}
          <directionalLight
            castShadow
            position={[0, 10, 0]}
            intensity={1.5}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* A light to help illumnate the spinning boxes */}
          <pointLight position={[-10, 0, -20]} intensity={0.5} />
          <pointLight position={[0, -10, 0]} intensity={1.5} />
          <group>
            {/* This mesh is the plane (The floor) */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -5, 0]}
              receiveShadow
            >
              <planeBufferGeometry attach="geometry" args={[100, 100]} />
              <shadowMaterial attach="material" opacity={0.3} />
            </mesh>
            <SpinningMesh
              position={[0, 0, 0]}
              color="lightblue"
              args={[2, 2, 2]}
              speed={2}
            />
            <SpinningMesh
              position={[-2, 1, -5]}
              color="lightgreen"
              args={[2, 2, 2]}
              speed={6}
            />
            <SpinningMesh
              position={[5, 1, -2]}
              color="pink"
              args={[2, 2, 2]}
              speed={6}
            />
          </group>
          {/* Allows us to move the canvas around for different prespectives */}
        </Canvas>
      
      </div>
      <Text/>
    </>
  );
};

export default App;
