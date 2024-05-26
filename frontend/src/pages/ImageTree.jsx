import { ForceGraph3D } from 'react-force-graph';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import defaultimage from '../image/download.jpeg'
import logo from '../image/logo.png'
import background from "../image/background.jpeg";

const ImageTree = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/alltree');
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        console.log('errorss',error);
      }
    };

    fetchData();
  }, []);

  const nodes = [{
    id: 'All',
    user: 'IITJ',
    description: 'IITJ',
    img:logo
  }];
const links = [];


const processNode = (node, parentId = null) => {
   const nodeData = {
     id: node.rollNo,
    user: node.name,
     description: node.rollNo,
    img: node.picture ? `http://172.31.49.27:8000/${node.picture}`  : defaultimage
  };
  nodes.push(nodeData);
    if (node.parentId) {
    links.push({ source: node.parentId, target: node.rollNo });
  }
  else{
      links.push({ source: 'All', target: node.rollNo });

  }
    node.children.forEach(child => {
    processNode(child);
  });
}
data.forEach(element => {
  processNode(element)
});
const graphdata=
  {
    nodes: nodes,
    links: links
  }
  const mystyle={
    backgroundImage: `url(${background})`,
    backdropFilter: "blur(6px)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    opacity: '0.8',
   };
  console.log(graphdata)

  return (
    <div >
        <ForceGraph3D
        backgroundColor={'#1b2735'}
        nodeColor={() => 'red'} 
        linkColor={'#1b2735'}
        width={window.innerWidth}
        height={window.innerHeight}
        linkCurvature={1}
        linkCurveRotation={2}
        linkWidth={0.5}
       graphData={graphdata}
       nodeLabel={node => `${node.user}: ${node.description}`}
       nodeAutoColorBy="user"
       linkDirectionalParticles={1}
       nodeThreeObject={({ img }) => {
         const imgTexture = new THREE.TextureLoader().load(img);
         imgTexture.colorSpace = THREE.SRGBColorSpace;
         const material = new THREE.SpriteMaterial({ 
           
           map: imgTexture ,
           color: 0xffffff,
       });
         const sprite = new THREE.Sprite(material);
         sprite.scale.set(12, 12);

         return sprite;
       }}
     />
      </div>

  );
};

export default ImageTree;
