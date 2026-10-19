/* Orcas Player & Family Hub — shared mobile navigation v1 */
(function(){
'use strict';
function drawer(){return document.getElementById('mob-nav');}
window.openMenu=function(){var m=drawer();if(!m)return;m.hidden=false;m.classList.add('open');document.body.style.overflow='hidden';};
window.closeMenu=function(){var m=drawer();if(!m)return;m.classList.remove('open');m.hidden=true;document.body.style.overflow='';};
document.addEventListener('keydown',function(e){if(e.key==='Escape')window.closeMenu();});
document.addEventListener('click',function(e){var m=drawer();if(m&&m.classList.contains('open')&&e.target===m)window.closeMenu();});
window.addEventListener('resize',function(){if(window.innerWidth>760)window.closeMenu();});
})();
