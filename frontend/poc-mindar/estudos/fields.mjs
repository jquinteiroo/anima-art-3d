// Coordenadas artísticas normalizadas: x da esquerda à direita; y de cima para baixo.
// Relevo autoral aproximado, não uma reconstrução de profundidade por IA.
export const WORKS = [
  {id:'onda',title:'A Grande Onda',artist:'Katsushika Hokusai',year:'c. 1830–32',file:'onda.jpg',accent:'#a4c8da',note:'A crista avança em um ciclo lento. O mar e a embarcação acompanham o movimento em ritmos distintos.',tags:['Ondulação do mar','Balanço da embarcação','Relevo da crista']},
  {id:'danca',title:'A Aula de Dança',artist:'Edgar Degas',year:'1874',file:'danca.jpg',accent:'#d3b49b',note:'Um ensaio de gestos mínimos: movimento do tule e balanço discreto das figuras, com rostos preservados.',tags:['Tule em movimento','Gestos discretos','Profundidade do salão']},
  {id:'iris',title:'Íris',artist:'Vincent van Gogh',year:'1890',file:'iris.jpg',accent:'#bbb7df',note:'As hastes cedem levemente à brisa. As flores respondem com pequenas diferenças de tempo; o vaso permanece imóvel.',tags:['Hastes flexíveis','Ritmos independentes','Vaso ancorado']},
  {id:'campo',title:'Campo de Trigo com Ciprestes',artist:'Vincent van Gogh',year:'1889',file:'campo.jpg',accent:'#d5c487',note:'O vento percorre o trigo, alcança a copa dos ciprestes e conduz lentamente o céu, sem apagar as pinceladas.',tags:['Vento no trigo','Ciprestes flexíveis','Céu em movimento']}
];
export const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function smooth(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t);}
function ellipse(x,y,cx,cy,rx,ry){return 1-smooth(.65,1,Math.hypot((x-cx)/rx,(y-cy)/ry));}
// Distância à borda mantém as transições suaves no relevo e no movimento.
export function polygon(x,y,points,feather=.025){
  let inside=false,min=Infinity;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [ax,ay]=points[j],[bx,by]=points[i],dx=bx-ax,dy=by-ay;
    if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
    const t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1));
    min=Math.min(min,Math.hypot(x-ax-t*dx,y-ay-t*dy));
  }
  return smooth(-feather,feather,inside?min:-min);
}
const crest=[[0,.08],[.11,.015],[.28,.055],[.43,.17],[.55,.32],[.5,.46],[.37,.55],[.31,.51],[.3,.4],[.24,.38],[.17,.53],[0,.71]];
const boat=[[.36,.81],[.45,.87],[.61,.89],[.8,.88],[.76,.95],[.57,.96],[.43,.9]];
const nearDancer=[[.18,.38],[.24,.29],[.35,.27],[.42,.38],[.48,.49],[.58,.67],[.46,.77],[.41,.97],[.28,.98],[.26,.77],[.13,.69],[.14,.51]];
const middleDancer=[[.57,.32],[.62,.27],[.66,.3],[.66,.36],[.79,.41],[.75,.5],[.68,.52],[.64,.64],[.59,.65],[.59,.52],[.49,.47],[.52,.38]];
const treePoints=[[.75,.64],[.78,.42],[.8,.23],[.85,.01],[.88,.015],[.89,.27],[.95,.42],[.97,.62],[.92,.71],[.78,.73]];
export function field(id,x,y,rgb=[0,0,0]){
  const edge=smooth(0,.035,x)*(1-smooth(.965,1,x))*smooth(0,.035,y)*(1-smooth(.965,1,y));
  let depth=0,a=0,b=0,c=0;
  if(id==='onda'){
    const curl=polygon(x,y,crest,.026),water=smooth(.64,.83,y);
    const vessel=polygon(x,y,boat,.018);
    depth=.055*curl+.09*water+.016*vessel;
    a=curl*(1-vessel);b=water*(1-vessel);c=vessel;
  }else if(id==='danca'){
    const near=polygon(x,y,nearDancer,.023),middle=polygon(x,y,middleDancer,.018);
    const floor=smooth(.45,1,y);
    depth=.028*floor+.062*near+.025*middle+.025*ellipse(x,y,.87,.47,.13,.3);
    // A máscara exclui cabeças e fixa os pés. A animação é de tecido, não de esqueleto.
    a=near*smooth(.38,.48,y)*(1-smooth(.69,.81,y));
    b=middle*smooth(.34,.42,y)*(1-smooth(.48,.56,y));
    c=0;
  }else if(id==='iris'){
    const [r,g,bl]=rgb;
    const chroma=Math.max(r,g,bl)-Math.min(r,g,bl);
    const colorMask=smooth(.035,.19,chroma)*(1-smooth(.73,.86,y));
    const bouquet=ellipse(x,y,.5,.43,.52,.43)*colorMask;
    const vase=ellipse(x,y,.455,.79,.145,.195);
    depth=.075*bouquet+.05*vase;
    a=bouquet*(1-smooth(.52,.76,y));
    b=bouquet*smooth(.07,.18,bl-r)*(1-smooth(.59,.75,y));
    c=0;
  }else if(id==='campo'){
    const tree=polygon(x,y,treePoints,.025),wheat=smooth(.69,.83,y);
    const sky=(1-smooth(.38,.57,y))*(1-tree);
    depth=.015*smooth(.38,.6,y)+.065*tree+.06*wheat;
    a=sky;b=wheat;c=tree*(1-smooth(.55,.73,y));
  }else throw new Error('Obra desconhecida: '+id);
  return [depth*edge,a*edge,b*edge,c*edge];
}
