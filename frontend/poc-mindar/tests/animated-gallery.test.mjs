import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {ProjectionSession} from '../estudos/projection-session.mjs';
import {WORKS} from '../estudos/fields.mjs';

const html=await readFile(new URL('../galeria.html',import.meta.url),'utf8');
const source=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1].replaceAll('import(','loadModule(');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
function harness({loadGate=null,startGate=null,reduced=false}={}){
  const elements=new Map(),models=[],instances=[];
  function element(id){
    if(elements.has(id))return elements.get(id);
    const classes=new Set(),handlers={};
    const e={id,value:id==='tracking-choice'?'animadas':id==='panel-language'?'pt-BR':'',files:[],textContent:'',handlers,
      classList:{add:(...a)=>a.forEach(x=>classes.add(x)),remove:(...a)=>a.forEach(x=>classes.delete(x)),contains:x=>classes.has(x),toggle:(x,force)=>{const on=force??!classes.has(x);on?classes.add(x):classes.delete(x);return on;}},
      addEventListener:(type,fn)=>{handlers[type]=fn;},setAttribute:(name,v)=>{e[name]=v;},replaceChildren:()=>{},append:()=>{}};
    elements.set(id,e);return e;
  }
  class MindARThree{
    constructor(options){this.options=options;this.anchors=new Map();this.scene={};this.camera={};this.stopCount=0;this.renderCount=0;instances.push(this);
      this.renderer={setPixelRatio:()=>{},setAnimationLoop:fn=>{this.loop=fn;},render:()=>{this.renderCount++;},dispose:()=>{this.disposed=true;}};
    }
    addAnchor(index){const anchor={group:{add:group=>{anchor.group.child=group;}}};this.anchors.set(index,anchor);return anchor;}
    async start(){this.startRequested=true;if(startGate)await startGate.promise;this.started=true;}
    async stop(){this.stopCount++;}
  }
  async function createArtwork(work){
    if(loadGate)await loadGate.promise;
    const model={id:work.id,group:{position:{}},updates:[],disposed:0,update(time,options){this.updates.push({time,...options});},dispose(){this.disposed++;}};
    models.push(model);return model;
  }
  const context=vm.createContext({console,performance,Uint8Array,URL,Promise,
    document:{hidden:false,getElementById:element,createElement:()=>element('new-'+Math.random())},
    window:{isSecureContext:true,matchMedia:()=>({matches:reduced}),addEventListener:()=>{}},
    navigator:{mediaDevices:{getUserMedia(){}}},setTimeout:()=>1,clearTimeout:()=>{},
    fetch:async path=>({ok:path==='./estudos/assets/obras.mind',headers:{get:()=>''}}),
    loadModule:async name=>{
      if(name==='mindar-image-three')return {MindARThree};
      if(name.endsWith('art-scene.mjs'))return {createArtwork};
      if(name.endsWith('fields.mjs'))return {WORKS};
      if(name.endsWith('projection-session.mjs'))return {ProjectionSession};
      throw new Error('Módulo inesperado: '+name);
    }
  });
  vm.runInContext(source,context);
  const api=vm.runInContext('({checkTargetFiles,beginAR,startAR,endAR,getIndex:()=>currentIndex,getSession:()=>projectionSession})',context);
  return {api,element,models,instances,context};
}
test('arquivo padrão e índices associam cada alvo à projeção e à HUD correta',async()=>{
  const h=harness();const target=await h.api.checkTargetFiles();
  assert.equal(target.path,'./estudos/assets/obras.mind');assert.deepEqual([...target.indices],[1,3,2,0]);
  await h.api.startAR(target);const ar=h.instances[0];
  assert.deepEqual(h.models.map(m=>m.id),['onda','danca','iris','campo']);
  const expected=[['A Grande Onda de Kanagawa',1],['A Aula de Dança',3],['Íris',2],['Campo de Trigo com Ciprestes',0]];
  for(let i=0;i<4;i++){
    ar.anchors.get(i).onTargetFound();
    assert.equal(h.element('panel-name').textContent,expected[i][0]);assert.equal(h.api.getIndex(),expected[i][1]);
    assert.match(h.element('ar-note').textContent,/2.5D animado/);
    ar.anchors.get(i).onTargetLost();assert.equal(h.api.getIndex(),null);
  }
  await h.api.endAR();
});
test('só o alvo visível anima; pausa e perda congelam o tempo e retomada continua',async()=>{
  const h=harness();await h.api.beginAR();const ar=h.instances[0];let stamp=performance.now();
  ar.anchors.get(0).onTargetFound();ar.loop(stamp+=16);
  assert.equal(h.models[0].updates.length,1);assert.equal(h.models[1].updates.length,0);
  h.element('panel-motion').handlers.click();const before=h.models[0].updates.at(-1).time;
  ar.loop(stamp+=16);assert.equal(h.models[0].updates.at(-1).time,before);
  h.element('panel-motion').handlers.click();ar.anchors.get(0).onTargetLost();const count=h.models[0].updates.length;
  ar.loop(stamp+=16);assert.equal(h.models[0].updates.length,count);
  ar.anchors.get(0).onTargetFound();ar.loop(stamp+=16);assert(h.models[0].updates.at(-1).time>before);
  await h.api.endAR();assert(ar.disposed);assert.equal(ar.loop,null);assert(h.models.every(m=>m.disposed===1));
});
test('movimento reduzido inicia pausado e permite retomada explícita',async()=>{
  const h=harness({reduced:true});await h.api.beginAR();const ar=h.instances[0];
  ar.anchors.get(2).onTargetFound();ar.loop(performance.now()+20);
  assert.equal(h.models[2].updates.at(-1).time,0);assert.match(h.element('panel-motion').textContent,/Retomar/);
  await h.api.endAR();
});
test('cancelar enquanto a textura carrega descarta recurso tardio e não abre câmera',async()=>{
  const gate=deferred(),h=harness({loadGate:gate});const pending=h.api.beginAR();
  // Aguarda a sessão chegar ao primeiro carregamento sem temporizador arbitrário.
  for(let i=0;i<20&&!h.instances.length;i++)await Promise.resolve();
  assert.equal(h.instances.length,1);await h.api.endAR();gate.resolve();await pending;
  assert.equal(h.instances[0].started,undefined);assert(h.models.every(m=>m.disposed===1));assert.equal(h.api.getSession(),null);
});
test('cancelar durante pedido de câmera interrompe também a abertura tardia',async()=>{
  const gate=deferred(),h=harness({startGate:gate});const pending=h.api.beginAR();
  for(let i=0;i<50&&!h.instances[0]?.startRequested;i++)await Promise.resolve();
  assert(h.instances[0].startRequested);await h.api.endAR();gate.resolve();await pending;
  assert(h.instances[0].stopCount>=2);assert.equal(h.instances[0].loop,null);assert(h.models.every(m=>m.disposed===1));
});
test('falha ao carregar textura encerra recursos e oferece erro recuperável',async()=>{
  const gate=deferred(),h=harness({loadGate:gate});const pending=h.api.beginAR();
  for(let i=0;i<20&&!h.instances.length;i++)await Promise.resolve();
  gate.reject(new Error('textura indisponível'));await pending;
  assert.equal(h.api.getSession(),null);assert(h.instances[0].disposed);
  assert.match(h.element('message-title').textContent,/Não foi possível/);
});
