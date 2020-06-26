let dotimgs = [
  'http://static2.fashionbeans.com/wp-content/uploads/2016/02/mangomancampsummer2.jpg',
  'https://avatars.mds.yandex.net/get-pdb/879261/ef0e88ec-8da4-4f5b-87fe-841cbad8c25e/s1200?webp=false',
  'https://avatars.mds.yandex.net/get-pdb/219263/b9c56bbe-07d4-471e-af27-d95f5c893094/s1200?webp=false',
  'https://porusski.me/wp-content/uploads/2016/10/Le-21eme-Adam-Katz-Sinding-London-Collection-Mens-Fashion-Week-Fall-Winter-2016-2017_AKS4128.jpg',
  'https://avatars.mds.yandex.net/get-pdb/1579627/993177d2-c87f-4e9b-a325-4ed9fad8dde4/s1200?webp=false'
  ]
  
let dots;
let homeimg;
let doti = 0;
let timeoutId;


document.addEventListener('DOMContentLoaded', () => {
	dots = document.querySelectorAll('.dot');
    homeimg = document.querySelector('.home');
	/*lk = document.querySelectorAll('.lkb');
	lk[0].className = 'homeimg';
	lk[0].style.cssText = 'right: 100px;';
	lk[1].className = 'homeimg';*/
	for (let i =0; i < dots.length;i++) {
		dots[i].onclick = () => {
			change1(doti, i);
		}
	}
	dots[0].style.backgroundColor = '#ceb505';
	
	homeimg.style.cssText = 'background-image: url('+dotimgs[0]+');';
	
    timeoutId = setTimeout(change, 3000);
});

function change(){
	change1(doti, doti+1);
}

function change1(predoti, newdoti){
	clearTimeout(timeoutId);
	dots[predoti].style.cssText = '';
	doti = newdoti;
	if (doti >= dots.length) doti = 0;
	dots[doti].style.backgroundColor = '#ceb505';
	/*smoothly(homeimg, 'style.cssText', 'background-image: url('+dotimgs[doti]+');');*/
	homeimg.style.cssText = 'background-image: url('+dotimgs[doti]+');';
	
	timeoutId = setTimeout(change, 3000);
}
