import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from "@react-three/drei";
import { AnimationMixer, TextureLoader, RepeatWrapping } from 'three';
import { gsap } from "gsap";
import { easing } from 'maath'
import SideBar from '@/components/sidebar';

const MemberCoinCard = ({ icon,
}) => {

  const sizes = ({ width: 1024, height: 800 });
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
        <CoinMedal data={icon} pointerPosition={pointerPosition} />
      </Canvas>
    </>
  )
}

const CoinMedal = ({ data, pointerPosition }, props) => {
  const group = useRef()
  const mixer = useRef()
  const coin_bottom_left = useRef(null); // icon
  const coin_bottom_right = useRef(null); // icon2
  const coin_top = useRef(null); // icon1
  const coin_left = useRef(null); // icon3
  const coin_right = useRef(null); // icon1
  const actions = useRef([])
  const { nodes, materials, animations } = useGLTF("GLB_CARD_icon_all.glb")
  const card_only = useRef(null);
  const photo_only = useRef(null);
  const ani_coin = useRef(null)
  let card_y, photo_y, ani_coin_y;
  let card_rotation_y, photo_rotation_y, ani_coin_rotation_y;

  useEffect(() => {
    mixer.current = new AnimationMixer(group.current);
    animations.forEach((clip) => {
      actions.current.push(mixer.current.clipAction(clip));
    });
    actions.current[0].play()
    group.current.scale.set(0.03, 0.03, 0.03);

    group.current.traverse((child) => {
      if (child.isMesh && child.name !== 'card') {
        child.material.reflectivity = 0.5;
        child.material.metalness = 0.5;
      }
      if (child.name === 'card') {
        child.material.roughness = 0.5
        child.material.metalness = 0.5;
      }
    });

    if (data) {
      const textureLoader = new TextureLoader();
      const texture = textureLoader.load(data);
      texture.wrapS = texture.wrapT = RepeatWrapping; // rotate if upside down
      texture.offset.set(0, 1);
      texture.repeat.set(1, -1);
      group.current.traverse((child) => {
        if (child.name === "photo") {
          child.material.map = texture;
        }
      });
    }
    coin_top.current = group.current.children[0].children.filter((el) => el.name === "icon1");
    coin_left.current = group.current.children[0].children.filter((el) => el.name === "icon3");
    coin_right.current = group.current.children[0].children.filter((el) => el.name === "icon5");
    coin_bottom_left.current = group.current.children[0].children.filter((el) => el.name === "icon");
    coin_bottom_right.current = group.current.children[0].children.filter((el) => el.name === "icon2");

    card_only.current = group.current.children[0].children.filter((el) => el.name === "card");
    photo_only.current = group.current.children[0].children.filter((el) => el.name === "photo");
    ani_coin.current = group.current.children[0].children.filter((el) => el.name === "icon007");

    card_y = card_only.current[0].position.y;
    photo_y = photo_only.current[0].position.y;
    ani_coin_y = ani_coin.current[0].position.y

    card_rotation_y = card_only.current[0].rotation.y;
    photo_rotation_y = photo_only.current[0].rotation.y;
    ani_coin_rotation_y = ani_coin.current[0].rotation.y;

    card_only.current[0].position.y = -130 + card_y;
    photo_only.current[0].position.y = -130 + photo_y;

    photo_only.current[0].rotation.y = -3;
    card_only.current[0].rotation.y = -3;
    ani_coin.current[0].rotation.y = -3

    gsap.to(card_only.current[0].position, {
      duration: 2.39,
      ease: "back.out(1.7)",
      y: card_y,
    });
    gsap.to(photo_only.current[0].position, {
      duration: 2.5,
      ease: "back.out(1.7)",
      y: photo_y,
    });
    gsap.to(ani_coin.current[0].position, {
      duration: 2.5,
      ease: "back.out(1.7)",
      y: ani_coin_y,
    });

    gsap.to(card_only.current[0].rotation, {
      duration: 2.5,
      ease: "power3.inOut",
      y: card_rotation_y,
    });
    gsap.to(photo_only.current[0].rotation, {
      duration: 2.5,
      ease: "power3.inOut",
      y: photo_rotation_y,
    });
    gsap.to(ani_coin.current[0].rotation, {
      duration: 2.5,
      ease: "power3.inOut",
      y: ani_coin_rotation_y,
    });
  })

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
      coin_top.current[0].position.y += Math.cos(state.clock.elapsedTime) * 0.05;
      coin_left.current[0].position.y += Math.sin(state.clock.elapsedTime * 0.4) * 0.025;
      coin_right.current[0].position.y += Math.cos(state.clock.elapsedTime * 0.8) * 0.03;
      coin_bottom_left.current[0].position.y += Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      coin_bottom_right.current[0].position.y += Math.cos(state.clock.elapsedTime * 0.2) * 0.02;

      photo_only.current[0].position.y += Math.sin(state.clock.elapsedTime) * 0.02;
      card_only.current[0].position.y += Math.sin(state.clock.elapsedTime) * 0.02;


      const dampingFactor = 0.25;
      const targetRotation = [-pointerPosition.current.y / 5, pointerPosition.current.x / 5, 0];

      easing.dampE(group.current.rotation, targetRotation, dampingFactor, delta);
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="icon5"
          castShadow
          receiveShadow
          geometry={nodes.icon5.geometry}
          material={materials["Mat.007"]}
          position={[53.265, 4.795, 14.239]}
          rotation={[3, -0.138, 2.482]}
        />
        <mesh
          name="icon3"
          castShadow
          receiveShadow
          geometry={nodes.icon3.geometry}
          material={materials["Mat.007"]}
          position={[-60.888, 16.439, 8.276]}
          rotation={[-2.374, -1.005, -2.396]}
        />
        <mesh
          name="icon2"
          castShadow
          receiveShadow
          geometry={nodes.icon2.geometry}
          material={materials["Mat.008"]}
          position={[13.488, -23.462, 46.495]}
          rotation={[-2.569, -0.711, -2.63]}
        />
        <mesh
          name="icon1"
          castShadow
          receiveShadow
          geometry={nodes.icon1.geometry}
          material={materials["Mat.009"]}
          position={[15.741, 37.598, 19.414]}
          rotation={[-2.876, 0.522, 2.953]}
        />
        <mesh
          name="icon"
          castShadow
          receiveShadow
          geometry={nodes.icon.geometry}
          material={materials["Mat.009"]}
          position={[-46.061, -26.086, 18.604]}
          rotation={[-2.887, 0.277, 2.995]}
        />
        <mesh
          name="card"
          castShadow
          receiveShadow
          geometry={nodes.card.geometry}
          material={materials.Mat}
          position={[0.82, 7.249, 1.554]}
          rotation={[-0.057, 0.194, 0.182]}
        />
        <mesh
          name="photo"
          castShadow
          receiveShadow
          geometry={nodes.photo.geometry}
          material={materials["Mat.010"]}
          position={[-0.82, 16.936, 1.89]}
          rotation={[-0.057, 0.194, 0.182]}
        />
        <mesh
          name="icon007"
          castShadow
          receiveShadow
          geometry={nodes.icon007.geometry}
          material={materials["Mat.008"]}
          position={[-29.577, 3.127, 16.634]}
          rotation={[-0.414, -0.299, -0.522]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("GLB_CARD_icon_all.glb");
export default MemberCoinCard