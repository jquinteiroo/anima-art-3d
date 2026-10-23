// Responsável pelo ciclo de vida do reconhecimento e das quatro projeções.
// Dependências injetadas permitem testar eventos e cancelamento sem abrir câmera.
export class ProjectionSession {
  constructor({MindARThree,createArtwork,entries,container,targetPath,onFound,onLost,onStatus,getSettings}){
    Object.assign(this,{MindARThree,createArtwork,entries,container,targetPath,onFound,onLost,onStatus,getSettings});
    this.stopped=false;this.models=[];this.ar=null;
  }
  async start(){
    if(this.stopped)return;
    this.ar=new this.MindARThree({container:this.container,imageTargetSrc:this.targetPath,uiLoading:'no',uiScanning:'no',maxTrack:1});
    const ar=this.ar;
    ar.renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.5));
    for(const entry of this.entries){
      this.onStatus('Preparando '+entry.work.title+'…');
      const art=await this.createArtwork(entry.work,{segments:120});
      if(this.stopped){art.dispose();return;}
      const state={...entry,art,time:0,visible:false};this.models.push(state);
      art.group.position.z=.003;
      const anchor=ar.addAnchor(entry.targetIndex);anchor.group.add(art.group);
      anchor.onTargetFound=()=>{
        if(this.stopped)return;
        state.visible=true;this.onFound(entry.catalogIndex);
      };
      anchor.onTargetLost=()=>{
        if(this.stopped)return;
        state.visible=false;this.onLost(entry.catalogIndex);
      };
    }
    if(this.stopped)return;
    this.onStatus('Abrindo câmera…');
    await ar.start();
    if(this.stopped){await ar.stop();return;}
    let previous=performance.now();
    ar.renderer.setAnimationLoop(stamp=>{
      if(this.stopped)return;
      const dt=Math.max(0,Math.min(.05,(stamp-previous)/1000));previous=stamp;
      const settings=this.getSettings();
      for(const model of this.models){
        if(!model.visible)continue;
        if(!settings.paused)model.time+=dt;
        model.art.update(model.time,{motion:settings.motion,depth:settings.depth,original:false});
      }
      ar.renderer.render(ar.scene,ar.camera);
    });
    this.onStatus('Aponte para qualquer uma das quatro obras');
  }
  async stop(){
    if(this.stopped)return;
    this.stopped=true;
    if(this.ar){
      this.ar.renderer.setAnimationLoop(null);
      try{await this.ar.stop();}catch(error){console.warn('Falha ao encerrar câmera',error);}finally{this.ar.renderer.dispose();}
    }
    for(const model of this.models)model.art.dispose();
    this.models=[];
  }
}
