// function LdapToEpoch1(){
//     var ldap=document.le1.ldap.value;
//     var sec=Math.floor(ldap/10000000);
//     sec-=11644473600;
//     var datum=new Date(sec*1000);
//     var outputtext="<b>Epoch/Unix time</b>: "+sec;
//     outputtext+="<br/><b>GMT</b>: "+datum.epochConverterGMTString()+"<br/><b>Your time zone</b>: "+datum.epochConverterLocaleString();$('#resultle1').html(outputtext);}
// function LdapToEpoch2(){var ldap=document.le2.ldap.value;var year=ldap.substr(0,4);var month=ldap.substr(4,2);var day=ldap.substr(6,2);var hour=ldap.substr(8,2);var minute=ldap.substr(10,2);var second=ldap.substr(12,2);var datum=new Date(Date.UTC(year,month-1,day,hour,minute,second));var outputtext="<b>Epoch/Unix time</b>: "+(datum.getTime()/1000);outputtext+="<br/><b>GMT</b>: "+datum.epochConverterGMTString()+"<br/><b>Your time zone</b>: "+datum.epochConverterLocaleString();$('#resultle2').html(outputtext);}
// function h2ldap(){var hw=createHDate('ldaph');if(typeof hw!=='object'){return;}
// var d=hw[0];var usedGMT=hw[1];var s=(d.getTime()/1000.0)+11644473600;var resulttext="<b>LDAP timestamp</b>: "+s+"0000000<br/>Scientific notation:  "+s+"e7";resulttext+="<br/>"+(usedGMT?'<b>':'')+"Date and time (GMT)"+(usedGMT?'</b>':'')+":  "+d.epochConverterGMTString();resulttext+="<br/>"+(usedGMT?'':'<b>')+"Date and time (your time zone)"+(usedGMT?'':'</b>')+": "+d.epochConverterLocaleString();if(!Ax())return;$('#ldaph-result').html(resulttext);}

// This value is stored as a large integer that represents the number of 100 nanosecond intervals since January 1, 1601 (UTC)
// (1 nanosecond = one billionth of a second) 
function fecha(valor) {
    var ldap=valor
    var sec=Math.floor(ldap/10000000)
    sec-=11644473600
    var outputtext="Epoch/Unix time: " + sec

    var datum=new Date(sec*1000)

    console.log('datum:', datum)
    console.log('outputtext:', outputtext)
}

// segundos desde el 1601 a date
function large2DateUTC(valor) {
    var ldap=valor;
    var sec=Math.floor(ldap/10000000);
    sec-=11644473600;
    return new Date((sec*1000)) //-(10800*1000)
}

// milisegundos desde 1970
function dateUTC2Large(midate) {

    var s=((new Date(midate)).getTime()/1000.0)+11644473600;

    console.log('s:', s)
    return s+"0000000"
}

function diasNanoSegundos(dias) {
    let unDia = (1000 * 24 * 60 * 60)
    return (((unDia*10000))*dias)
}

function diferenciaDias(origen) {
    var date1 = new Date(origen)
    var date2 = new Date(); 
      
    // To calculate the time difference of two dates 
    var Difference_In_Time = date2.getTime() - date1.getTime(); 
      
    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
      
    //To display the final no. of days (result) 
    console.log("Total number of days between dates\n"
                   + date1 + "\n and \n" 
                   + date2 + " is: \n" 
                   + Difference_In_Days); 
}

function ldapToJS(n) {

    // Longer, equivalent to short version
    // return new Date(n/1e4 + new Date(Date.UTC(1601,0,1)).getTime());
  
    // Shorter, more efficient. Uses time value for 1601-01-01 UTC
    return new Date(n/1e4 - 1.16444736e13);
}

console.log('ldap2js:', ldapToJS(132278078869594681))

fecha(132278078869594681)
fecha(132278078869594681 + diasNanoSegundos(30))
console.log('Fecha:', large2DateUTC(132278078869594681-diasNanoSegundos(10)))
console.log('90 dias nano:', diasNanoSegundos(90))


console.log('Large to date:', large2DateUTC(132278078869594681))
diferenciaDias(large2DateUTC(132278078869594681))

console.log(new Date(11644473600))

fecha(dateUTC2Large((new Date().getMilliseconds())))


fecha(116444736000000000)

/*

function h2ldap(){
    var hw=createHDate('ldaph');
    if(typeof hw!=='object') { return; }

    var d=hw[0];
    var usedGMT=hw[1];
    var s=(d.getTime()/1000.0)+11644473600;

    var resulttext="<b>LDAP timestamp</b>: "+s+"0000000<br/>Scientific notation:  "+s+"e7";
    resulttext+="<br/>"+(usedGMT?'<b>':'')+"Date and time (GMT)"+(usedGMT?'</b>':'')+":  "+d.epochConverterGMTString();
    resulttext+="<br/>"+(usedGMT?'':'<b>')+"Date and time (your time zone)"+(usedGMT?'':'</b>')+": "+d.epochConverterLocaleString();
    if(!Ax())return;
    $('#ldaph-result').html(resulttext);
}
*/