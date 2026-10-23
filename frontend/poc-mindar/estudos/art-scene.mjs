import * as THREE from 'three';
import {field} from './fields.mjs';

// Fábrica compartilhada entre a prévia e as âncoras MindAR.
// Largura = 1 unidade, frente = +Z. Não altera a imagem original.
export async function createArtwork(work,{height=null,segments=150}={}){
  const texture=await new THREE.TextureLoader().loadAsync(new URL('./assets/'+work.file,import.meta.url).href);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  const source=texture.image,aspect=height??source.height/source.width;
  const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(source,0,0);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
  const geometry=new THREE.PlaneGeometry(1,aspect,segments,Math.max(72,Math.round(segments*aspect)));
  const uv=geometry.getAttribute('uv'),data=new Float32Array(uv.count*4);
  for(let i=0;i<uv.count;i++){
    const x=uv.getX(i),y=1-uv.getY(i);
    const px=Math.min(source.width-1,Math.round(x*(source.width-1)));
    const py=Math.min(source.height-1,Math.round(y*(source.height-1)));
    const p=(py*source.width+px)*4;
    data.set(field(work.id,x,y,[pixels[p]/255,pixels[p+1]/255,pixels[p+2]/255]),i*4);
  }
  geometry.setAttribute('aField',new THREE.BufferAttribute(data,4));
  // O culling usa a caixa da geometria original; a malha animada pode sair dela.
  const uniforms={uTime:{value:0},uMotion:{value:.8},uDepth:{value:1},uOriginal:{value:0}};
  const movement={
    onda:`
      float swell=sin(t*.82);
      dx = aField.y*(.012*swell + .003*sin(t*1.64+uv.y*8.0))
         + aField.z*.007*sin(t*1.05-uv.x*10.0)
         + aField.w*.004*sin(t*.82+.3);
      dy = aField.y*.009*cos(t*.82) + aField.z*.004*sin(t*1.05-uv.x*10.0)
         + aField.w*.005*cos(t*.82+.3);
      dz = aField.y*.009*swell+aField.z*.005*sin(t*1.05-uv.x*10.0);`,
    danca:`
      dx = aField.y*.0035*sin(t*.75)+aField.z*.003*sin(t*.85+.9);
      dy = aField.y*.0015*sin(t*1.5+uv.x*18.0)+aField.z*.0012*sin(t*1.7+uv.x*12.0);
      dz = aField.y*.0035*sin(t*.75+uv.x*10.0)+aField.z*.003*cos(t*.85);`,
    iris:`
      dx = aField.y*.009*sin(t*.9+uv.x*3.4)+aField.z*.002*sin(t*1.6+uv.x*18.0);
      dy = aField.z*.002*cos(t*1.3+uv.x*11.0);
      dz = aField.y*.005*sin(t*.9+uv.x*4.0);`,
    campo:`
      dx = aField.y*.0045*sin(t*.35+uv.y*10.0)
         + aField.z*.0055*sin(t*1.2-uv.x*15.0)
         + aField.w*.007*sin(t*.75);
      dy = aField.y*.0025*cos(t*.35+uv.x*8.0)+aField.z*.0018*sin(t*1.8-uv.x*20.0);
      dz = aField.z*.004*sin(t*1.2-uv.x*15.0)+aField.w*.004*cos(t*.75);`
  }[work.id];
  const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader='attribute vec4 aField;\nuniform float uTime;\nuniform float uMotion;\nuniform float uDepth;\nuniform float uOriginal;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`
      #include <begin_vertex>
      float t=uTime;
      float dx=0.0; float dy=0.0; float dz=0.0;
      ${movement}
      float enabledEffect=1.0-uOriginal;
      transformed.x += dx*uMotion*enabledEffect;
      transformed.y += dy*uMotion*enabledEffect;
      transformed.z += (aField.x*uDepth + dz*uMotion*uDepth)*enabledEffect;
    `);
  };
  material.customProgramCacheKey=()=>work.id;
  const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;
  const group=new THREE.Group();group.add(mesh);
  return {
    group,mesh,height:aspect,uniforms,
    update(time,{motion=.8,depth=1,original=false}={}){
      uniforms.uTime.value=time;uniforms.uMotion.value=motion;
      uniforms.uDepth.value=depth;uniforms.uOriginal.value=original?1:0;
    },
    dispose(){geometry.dispose();material.dispose();texture.dispose();group.removeFromParent();}
  };
}
