const scenes=[...document.querySelectorAll('.story-scene')];
const number=document.querySelector('.story-current');
const bar=document.querySelector('.story-progress span');
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
let frame=0;
function update(){
  frame=0;
  if(motion.matches)return;
  let active=0,closest=Infinity;
  for(const [index,scene] of scenes.entries()){
    const box=scene.getBoundingClientRect();
    const distance=Math.abs(box.top+box.height*.42-innerHeight*.47);
    if(distance<closest){closest=distance;active=index}
    const image=scene.querySelector('img');
    const offset=Math.max(-28,Math.min(28,(innerHeight*.5-(box.top+box.height*.5))*.055));
    image.style.setProperty('--photo-y',`${offset}px`);
  }
  number.innerHTML=`${String(active+1).padStart(2,'0')} <small>/ 03</small>`;
  bar.style.transform=`scaleX(${(active+1)/scenes.length})`;
}
function schedule(){if(!frame)frame=requestAnimationFrame(update)}
if(scenes.length&&!motion.matches){
  if('IntersectionObserver' in window){
    document.documentElement.classList.add('cinema-ready');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in-view');observer.unobserve(entry.target)}
    },{threshold:.12,rootMargin:'0px 0px 5% 0px'});
    scenes.forEach(scene=>observer.observe(scene));
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  update();
}
