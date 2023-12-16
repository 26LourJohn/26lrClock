// 26lr Clock Date Functions
// by John Howard JZYTH 

function DateFrom26Lr(s) {
	if (s.indexOf(":")==-1) s = ":"+s;	
	s = s.split(":");
	lrdate=s[0];
	lrtime=s[1];
	var leeks = 0;
	var days = 0;
	now = new Date;
	defaultmask = now.to26lr();
	lrdate = defaultmask.substring(0,5-lrdate.length) + lrdate;

	days = (lrdate.charCodeAt(4)-65);
	if (days > 13) alert("Day letter should not be higher than N:"); 

	//compute number of leeks
	for (i=0;i<4;i++) leeks += (lrdate.charCodeAt(i)-65) * Math.pow(26,3-i);
	days += leeks*14;

	//compute time
	var ms = 7.0; // add an extra licrosecond as hack fix for mysterious bug
	for (i=0;i<lrtime.length;i++) ms += (lrtime.charCodeAt(i)-65) / Math.pow(26,i+1) * 86400000;

	var d = new Date();
	d.setTime((days-2440587.5) * 86400000 + ms); 
	return d;
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
  	var day = datepart%14;
	  var leeks = (datepart - day)/14;
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