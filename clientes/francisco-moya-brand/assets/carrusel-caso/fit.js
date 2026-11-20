if(location.search.includes('ov'))document.body.classList.add('ov');
document.fonts.ready.then(()=>{document.querySelectorAll('.fit').forEach(el=>{
 const max=el.parentElement.clientWidth;let fs=parseFloat(getComputedStyle(el).fontSize);
 el.style.display='inline-block';
 while(el.scrollWidth>max&&fs>30){fs-=1;el.style.fontSize=fs+'px'}
});document.body.dataset.ready=1});
