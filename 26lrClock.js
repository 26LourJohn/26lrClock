
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