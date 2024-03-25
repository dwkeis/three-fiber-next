import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from "@react-three/drei";
import { easing } from 'maath'
import { AnimationMixer } from 'three';
import { gsap } from "gsap";
import SideBar from '@/components/sidebar';

const VotingBox = ({
  sizes = {
    width: 1000,
    height: 500,
  } }) => {
  const canvas = useRef()
  const canvasStyle = {
    width: `${sizes.width}px`,
    height: `${sizes.height}px`,
  };
  const pointerPosition = useRef({ x: 0, y: 0 });
  const handleMouseMove = (event) => {
    pointerPosition.current.x = (event.clientX / sizes.width) - 1;
    pointerPosition.current.y = -(event.clientY / sizes.height) + 0.5;
  };

  useEffect(() => {
    canvas.current.addEventListener('mousemove', handleMouseMove);
  }, [])

  return (
    <>
      <SideBar />
      <Canvas
        ref={canvas}
        style={canvasStyle}
        camera={{
          fov: 50,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
        }}
      >
        <Environment preset='sunset' />
        <Box pointerPosition={pointerPosition} />
      </Canvas>
    </>
  )
}

const Box = ({ pointerPosition }) => {
  const group = useRef();
  const group2 = useRef();
  const gltf = useGLTF("/box_0218824.glb");
  const mixer = useRef()
  const actions = useRef([])


  useEffect(() => {
    group2.current.rotation.set(0.2, 0.8, 0.3);
    group2.current.traverse((child) => {
      if (child.name === "Cube_5") {
        child.material.iridescence = 1;
        child.material.iridescenceIOR = 1;
        child.material.iridescenceThicknessRange = [100, 800];
        child.material.opacity = 0.5;
        child.material.transparent = true;
      }
    });

    mixer.current = new AnimationMixer(group2.current);
    gltf.animations.forEach((clip) => {
      actions.current.push(mixer.current.clipAction(clip));
    });
    actions.current[0].play()

    group.current.scale.set(0.005, 0.005, 0.005)

    gsap.to(group.current.scale, {
      duration: 1,
      ease: "bounce.out",
      x: 0.04,
      y: 0.04,
      z: 0.04,
    });
  })

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
      const dampingFactor = 0.25;
      const targetRotation = [-pointerPosition.current.y / 5, pointerPosition.current.x / 3, 0];

      easing.dampE(group.current.rotation, targetRotation, dampingFactor, delta);
    }
  })

  return (
    <group ref={group}>
      <primitive ref={group2} object={gltf.scene} />
    </group>
  );
}

useGLTF.preload("box_0218824.glb");
export default VotingBox
