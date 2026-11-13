/* 景點天氣預報:Open-Meteo(免金鑰),載入頁面時即時抓取;失敗就不顯示 */
(function(){
  var START='2026-11-14', END='2026-11-16';
  var P={ // 景點座標(約略位置即可,預報網格約 10 km)
    'pinglin':[24.936,121.711],'nanao':[24.463,121.797],'qingshui':[24.221,121.651],
    'qixingtan':[24.027,121.628],'yuli-noodle':[23.335,121.312],'fuli-straw':[23.180,121.250],'chishang':[23.100,121.215],
    'nuannuan':[22.757,121.144],'tiehua':[22.756,121.147],'fukui':[22.752,121.150],'kelai':[22.755,121.148],'dezhi':[24.936,121.711],'xiaoyeliu':[22.884,121.206],
    'jialulan':[22.932,121.249],'donghe-baozi':[22.968,121.298],'sanxiantai':[23.123,121.405],
    'qinbuzhizi':[23.320,121.470],'changhong':[23.400,121.500],'shitiping':[23.500,121.500],
    'baqi':[23.620,121.520],'suao':[24.590,121.850],'luodong-night':[24.680,121.770],'luodong-market':[24.677,121.769],
    'luodong-forest':[24.680,121.760],'starbucks-luodong':[24.680,121.760],'jiaoxi':[24.670,121.770],'toucheng':[24.860,121.820]
  };
  function icon(c){
    if(c===0)return['sunny','晴'];
    if(c<=2)return['partly','多雲時晴'];
    if(c===3)return['cloudy','陰'];
    if(c===45||c===48)return['fog','霧'];
    if(c>=95)return['storm','雷雨'];
    if(c>=51&&c<=67||c>=80&&c<=82)return['rain','有雨'];
    return['cloudy','陰'];
  }
  var cards=[].slice.call(document.querySelectorAll('.day .spot'));
  var days=document.querySelectorAll('.day');
  var items=[];
  cards.forEach(function(a){
    var day=[].indexOf.call(days,a.closest('.day'));
    var slug=(a.getAttribute('href').match(/spots\/(.+)\.html/)||[])[1];
    var t=(a.textContent.match(/(\d{1,2}):(\d{2})/)||[]);
    var hr=t[1]?Math.min(23,+t[1]+(+t[2]>=30?1:0)):12; // 抵達時刻四捨五入到整點
    if(P[slug])items.push({a:a,day:day,slug:slug,hr:hr,t:t[0]||''});
  });
  var slugs=[];items.forEach(function(i){if(slugs.indexOf(i.slug)<0)slugs.push(i.slug)});
  if(!slugs.length)return;

  var bar=document.createElement('div');bar.className='wxbar';
  bar.innerHTML='<span class="wxstat">⏳ 天氣載入中…</span><button type="button">🔄 立即更新</button>';
  var anchor=document.querySelector('h1+.sub')||document.querySelector('h1');
  anchor.insertAdjacentElement('afterend',bar);
  var stat=bar.querySelector('.wxstat'),btn=bar.querySelector('button');

  function load(){
    stat.textContent='⏳ 更新中…';btn.disabled=true;
    var url='https://api.open-meteo.com/v1/forecast?latitude='+slugs.map(function(s){return P[s][0]}).join(',')+
      '&longitude='+slugs.map(function(s){return P[s][1]}).join(',')+
      '&hourly=weather_code,temperature_2m,precipitation_probability'+
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max'+
      '&timezone=Asia%2FTaipei&start_date='+START+'&end_date='+END+'&_='+Date.now();
    fetch(url,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
      if(!Array.isArray(d))d=[d];
      var by={};slugs.forEach(function(s,i){by[s]=d[i]});
      [].forEach.call(document.querySelectorAll('.wx,.wxsum'),function(e){e.remove()});
      var agg=[[],[],[]];
      items.forEach(function(it){
        var w=by[it.slug];if(!w)return;
        var k=it.day*24+it.hr,h=w.hourly;
        if(h.weather_code[k]==null)return;
        var ic=icon(h.weather_code[k]),tp=Math.round(h.temperature_2m[k]),pr=h.precipitation_probability[k];
        agg[it.day].push(w.daily.precipitation_probability_max[it.day]);
        var el=document.createElement('div');el.className='wx'+(pr>=60?' wet':'');
        el.title='當天 '+Math.round(w.daily.temperature_2m_min[it.day])+'–'+Math.round(w.daily.temperature_2m_max[it.day])+'°C';
        el.innerHTML='<img src="images/deco/wx-'+ic[0]+'.svg" alt="'+ic[1]+'"><div><b>'+ic[1]+'</b><span>'+tp+'°C</span><span>☔ '+pr+'%</span><small>'+(it.t||'')+' 時段</small></div>';
        it.a.appendChild(el);
      });
      [].forEach.call(days,function(day,i){
        var a=agg[i];if(!a.length)return;
        var mx=Math.max.apply(null,a);
        var p=document.createElement('p');p.className='wxsum';
        p.textContent=(mx>=60?'☔ 當天降雨機率偏高(最高 '+mx+'%),雨具與防滑要備好':'🌤 當天降雨機率最高 '+mx+'%')+'。下方天氣為各景點預計抵達時段的預報。';
        var h=day.querySelector('.sub');(h||day.querySelector('h2')).insertAdjacentElement('afterend',p);
      });
      var n=new Date();
      stat.textContent='✅ 已更新 '+n.getHours()+':'+('0'+n.getMinutes()).slice(-2)+'(Open-Meteo,出發前請再看中央氣象署)';
    }).catch(function(){
      stat.textContent='⚠️ 天氣暫時抓不到,請檢查網路後按「立即更新」';
    }).then(function(){btn.disabled=false});
  }
  btn.addEventListener('click',load);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)load()});
  setInterval(load,30*60*1000);
  load();
})();
