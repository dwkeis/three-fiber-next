import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from "@react-three/drei";
import { easing } from 'maath'
import { AnimationMixer, TextureLoader, RepeatWrapping } from 'three';
import { gsap } from "gsap";
import SideBar from '@/components/sidebar';

const MemberCard = ({ data,
  sizes = {
    width: 1000,
    height: 600,
  },
  scale = 1, noCoin = false, level }) => {
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
          position: [0, 0, 1],
        }}
      >
        <Environment preset='sunset' />
        <Medal scale={scale} data={data} sizes={sizes} pointerPosition={pointerPosition} noCoin={noCoin} level={level} />
      </Canvas>
    </>
  )
}


const Medal = ({ data, pointerPosition, noCoin, level }, props) => {
  const group = useRef()
  const group2 = useRef()
  const mixer = useRef()
  const actions = useRef([])
  const { nodes, materials, animations } = useGLTF("GLB_CARD_004.glb")
  let intro = true

  useEffect(() => {
    group.current.position.y = -0.1
    group.current.position.x = 0.6
    group.current.rotation.y = 1
    mixer.current = new AnimationMixer(group.current);
    animations.forEach((clip) => {
      actions.current.push(mixer.current.clipAction(clip));
    });
    actions.current[0].play()

    group.current.traverse((child) => {
      console.log(child);
      if (child.isMesh) {
        child.material.metalness = 0.3;
        // child.material.reflectivity = 0.5;
      }
    });
    gsap.to(group.current.position, {
      duration: 2.5,
      ease: "power3.inOut",
      x: 0,
    });
    gsap.to(group.current.rotation, {
      duration: 2.5,
      ease: "power3.inOut",
      y: 0,
      onComplete: () => intro = false
    });


    if (data) {
      const texture = new TextureLoader().load(data.icon); // data.icon || `data:image/png;base64,${data}`
      texture.wrapS = texture.wrapT = RepeatWrapping; // rotate if upside down
      texture.offset.set(0, 1);
      texture.repeat.set(1, -1);
      group.current.traverse((child) => {
        if (child.name === "photo") {
          child.material.map = texture;
        }
      });
    }
    if (level) {
      const newTexture = new TextureLoader().load(`${level}_001.png`); // change between bronze or silver
      newTexture.wrapS = newTexture.wrapT = RepeatWrapping; // must rotate otherwise it will fail to located
      newTexture.offset.set(0, 1);
      newTexture.repeat.set(1, -1);
      group.current.traverse((child) => {
        if (child.name === "icon") {
          child.material.map = newTexture;
        }
      });
    }

  }, [mixer, animations]);
  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);

      group2.current.rotation.y += Math.cos(state.clock.elapsedTime) * 0.0008
      group2.current.rotation.x += Math.sin(state.clock.elapsedTime) * 0.0008

      const dampingFactor = 0.25;
      const targetRotation = [-pointerPosition.current.y / 5, pointerPosition.current.x / 5, 0];

      easing.dampE(group.current.rotation, targetRotation, dampingFactor, delta);
    }
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" ref={group2}>
        <mesh
          name="icon"
          geometry={nodes.icon.geometry}
          material={materials.Mat}
          position={[-0.107, -0.144, -0.005]}
          rotation={[1.32, 0.052, -0.495]}
          scale={0.01}
          visible={!noCoin}
        />
        <mesh
          name="photo"
          geometry={nodes.photo.geometry}
          material={materials["Mat.2"]}
          position={[0, 0.17, 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
        <mesh
          name="card001"
          geometry={nodes.card001.geometry}
          material={materials["Mat.007"]}
          position={[0, 0.072, 0.014]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.1}
        />
      </group>
    </group>
  );
}

useGLTF.preload("GLB_CARD_004.glb");
export default MemberCard