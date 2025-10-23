// 26lr Clock Date Functions
// Now using 7 Day A-G Weeks TZYOC
// by John Howard JZYTH 
Date.prototype.from26Lr = function (s) {
	if (s.indexOf(":")==-1) s = ":"+s;	
	s = s.split(":");
	lrdate=s[0];
	lrtime=s[1];
	var weeks = 0;
	var days = 0;
	//now = new Date;
	defaultmask = this.to26lr();
	lrdate = defaultmask.substring(0,5-lrdate.length) + lrdate;

	days = (lrdate.charCodeAt(4)-65);
	if (days > 6) alert("Day letter should not be higher than G:"); 
	//if (days > 13) alert("Day letter should not be higher than N:"); 

	//compute number of weeks
	for (i=0;i<4;i++) weeks += (lrdate.charCodeAt(i)-65) * Math.pow(26,3-i);

	days += weeks * 7; //14

	//compute time
	var ms = 7.0; // add an extra licrosecond as hack fix for mysterious bug
	for (i=0;i<lrtime.length;i++) ms += (lrtime.charCodeAt(i)-65) / Math.pow(26,i+1) * 86400000;

	var d = new Date();
	d.setTime((days-2440587.5) * 86400000 + ms); 
	return d;
}

function longitudeto26lr(l){
	//input longitude -180 (West) to 180 (East)
	//return 26 Lr Time of Mean Noon there
	var t = l<=0? l / -360 : (360-l)/360 ;
	var b26t = t.toString(26);
    var sOut = "";
    for (i=2;i<7;i++){
    	var c = b26t.charCodeAt(i);
		if (isNaN(c)) {sOut += "A"}
		else {
			sOut += String.fromCharCode(c < 97 ? c + 17 : c - 22);
		}
	}
	return sOut;
}

function longitudefrom26lr(s){
	var p = 0.0;
	for (i=0;i<s.length;i++) p += (s.charCodeAt(i)-65) / Math.pow(26,i+1);
	return  p <= .5 ? p * -360 : 360 - p * 360;
}

function longitudetocolor(l){
	var t = l<=0? l / -360 : (360-l)/360 ;
	return "hsl("+(t*360)+", 100%, 50%)";
}

function colorfrom26lr(s){
	var p = 0.0;
	for (i=0;i<s.length;i++) p += (s.charCodeAt(i)-65) / Math.pow(26,i+1);
	return  p * 360;
}

Date.prototype.timepart = function () {
  	var timepart = this.valueOf()/86400000 + .5;  
  	timepart -= Math.floor(timepart);
  	return timepart;
};

Date.prototype.to26lr = function () {
  	var timepart = this.valueOf()/86400000 + .5; //86400000 is millesconds in a day, 2440587.5 juliandate of Jan 1 1970   		 
  	var datepart = Math.floor(timepart) + 2440587;
  	timepart -= Math.floor(timepart);		
  	var day = datepart%7; //14
	  var leeks = (datepart - day)/7;
    var b26datepart = leeks.toString(26)+day.toString(26);
    var b26timepart = timepart.toString(26);
    var sOut = "";
    for (i=0;i<5;i++){
    	var c = b26datepart.charCodeAt(i);
			sOut += String.fromCharCode(c < 97 ? c + 17 : c - 22);
		}
		sOut += ":";
    for (i=2;i<7;i++){
    	var c = b26timepart.charCodeAt(i);
			if (isNaN(c)) {sOut += "A"}
			else {
				sOut += String.fromCharCode(c < 97 ? c + 17 : c - 22);
			}
		}
	return sOut; 
};

Date.prototype.toJulian = function () {
  	var timepart = this.valueOf()/86400000 + .5; //86400000 is millesconds in a day, 2440587.5 juliandate of Jan 1 1970
  	var datepart = Math.floor(timepart) + 2440587;
  	timepart -= Math.floor(timepart);
    return datepart+timepart;
};

Date.prototype.dayOfYear = function () {
	return Math.floor((this.getTime() - new Date(this.getFullYear(), 0, 0)) / 864e5);
};

 
Date.prototype.equationoftime = function(){

	      /*
         Equation of Time calculations copied from
         JavaScript Sun Calculator
         © 2001 Juergen Giesen
		 http://www.jgiesen.de
		 */
             
        function RightAscension(T) {
            var K = Math.PI/180.0
            var L, M, C, lambda, RA, eps, delta, theta
            L = sunL(T)
            M = 357.52910 + 35999.05030*T - 0.0001559*T*T - 0.00000048*T*T*T
            M = M % 360
            if (M<0) M = M + 360
            C = (1.914600 - 0.004817*T - 0.000014*T*T)*Math.sin(K*M)
            C = C + (0.019993 - 0.000101*T)*Math.sin(K*2*M)
            C = C + 0.000290*Math.sin(K*3*M)
            theta = L + C; // true longitude of the Sun
            eps = EPS(T)
            eps = eps + 0.00256*Math.cos(K*(125.04 - 1934.136*T))
            lambda = theta - 0.00569 - 0.00478*Math.sin(K*(125.04 - 1934.136*T)); // apparent longitude of the Sun
            RA = Math.atan2(Math.cos(K*eps)*Math.sin(K*lambda), Math.cos(K*lambda))
            RA = RA/K
            if (RA<0) RA = RA + 360.0;
            delta = Math.asin(Math.sin(K*eps)*Math.sin(K*lambda))
            delta = delta/K
            DEC = delta
            return RA
        }
        
        function sunL(T){
            var L = 280.46645 + 36000.76983*T + 0.0003032*T*T
            L = L % 360
            if (L<0) L = L + 360
            return L
        }
        
        function deltaPSI(T){
            var K = Math.PI/180.0
            var deltaPsi, omega, LS, LM
            LS = sunL(T)
            LM = 218.3165 + 481267.8813*T
            LM = LM % 360
            if (LM<0) LM = LM + 360
            omega = 125.04452 - 1934.136261*T + 0.0020708*T*T + T*T*T/450000
            deltaPsi = -17.2*Math.sin(K*omega) - 1.32*Math.sin(K*2*LS) - 0.23*Math.sin(K*2*LM) + 0.21*Math.sin(K*2*omega)
            deltaPsi = deltaPsi/3600.0
            return deltaPsi
        }
        
        function EPS(T) {
            var K = Math.PI/180.0
            var LS = sunL(T)
            var LM = 218.3165 + 481267.8813*T
            var eps0 =  23.0 + 26.0/60.0 + 21.448/3600.0 - (46.8150*T + 0.00059*T*T - 0.001813*T*T*T)/3600
            var omega = 125.04452 - 1934.136261*T + 0.0020708*T*T + T*T*T/450000
            var deltaEps = (9.20*Math.cos(K*omega) + 0.57*Math.cos(K*2*LS) + 0.10*Math.cos(K*2*LM) - 0.09*Math.cos(K*2*omega))/3600
            return eps0 + deltaEps
        }
        
	var timepart = this.valueOf()/86400000 + .5;
	var datepart = Math.floor(timepart) + 2440587;
	timepart -= Math.floor(timepart);
	var JD = datepart+timepart;
	var K = Math.PI/180.0
	var  T = (JD - 2451545.0) / 36525.0
	var eps = EPS(T);
	var RA = RightAscension(T)
	var LS = sunL(T)
	var deltaPsi = deltaPSI(T)
	var E = LS - 0.0057183 - RA + deltaPsi*Math.cos(K*eps)
	if (E>5) E = E - 360.0
	E = E*4; // deg. to min
	E = Math.round(1000*E)/1000
	return E
	
}

Date.prototype.dateDifference = function (d){
	var diff = d.getTime() - this.getTime();
	var future = diff < 0;
	if (future) diff *= -1;	
	var s = Math.floor(diff/1000);
	var days = Math.floor(s/86400);
	  s -= (days * 86400);
	var h = Math.floor(s / 3600);
	  s -= (h * 3600);
	  var m =Math.floor(s / 60);
	  s -= (m * 60);
	  var result = future?"+ ":"- ";
	  if(days>0){
		  if(days>1)
			  result += days + " Days ";
		  else
			  result += days + " Day ";
	}
	result += h + (m<10?":0":":") + m + (s<10?":0":":") + s;
	return result;
  }

  Date.prototype.getTZOffset = function(tz){
	var h = this.toLocaleString("en-US", {
	  timeZone: tz,
	  timeZoneName: 'shortOffset'
	}).split('GMT')[1];
	if (isNaN(h.valueOf())) {
	  return (h.split(':')[0].valueOf() * -60 - h.split(':')[1].valueOf() );
	 }
	return h.valueOf() * -60;
  }