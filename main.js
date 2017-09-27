// ==UserScript==
// @name         osu!-download-beatmap-from-bloodcat
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description   download osu beatmap from bloodcat
// @author       jacky2001114(blow)
// @match        *://bloodcat.com/osu/?q=*&c=b&s=&m=*
// @match        *://osu.ppy.sh/b/*
// @match        *://osu.ppy.sh/s/*
// @match        *://osu.ppy.sh/p/beatmap?b=*
// @match        *://osu.ppy.sh/p/beatmap?s=*
// @match        *://bloodcat.com/osu/*
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(function() {

    'use strict';

    var str=location.href;

    var bool_cat = true;
    var bool_osu = true;


    var osu_b = str.indexOf("osu");
    var osu_c = str.indexOf(".sh");

    //check user is in osu/bloodcat page
    if(str.substring(osu_b,osu_c)!= "osu.ppy")
    {
        bool_osu=false;
    }
    else
    {
        bool_cat=false;
    }




    var beatmap_id="";


    //開始運行本腳本


    if(bool_osu){

        GM_setValue('OSU_enable',"true");
        var isS = str.indexOf('osu.ppy.sh/s');
        var isB = str.indexOf('osu.ppy.sh/b');
        var isP = str.indexOf('osu.ppy.sh/p');
        var eee=str.indexOf("?");
        var fff=str.indexOf("&");
        var isBeatmap =str.indexOf('beatmap');


        //check /s or /b
        if(isS > -1 && isB===-1 && isP ===-1 )
        {
           //alert('s');
            // the song url is /s
            GM_setValue('beatmap_id',str.substring(21));
            //Get title
            getTitle();




        }else if(isS===-1 && isB>-1 && isP ===-1){
         
//alert('b');
            // the song url is /b

            if(fff>-1){
               
                GM_setValue('beatmap_id',str.substring(21,fff));
                var id = GM_getValue('beatmap_id');
               //  alert(id+'1');
                creatButton(id);
            }else if(eee>-1){
                GM_setValue('beatmap_id',str.substring(21,eee));
                var id = GM_getValue('beatmap_id');
              //  alert(id);
                creatButton(id);
            }else if(eee === -1&& fff===-1){
                
            GM_setValue('beatmap_id',str.substring(21));
                var id = GM_getValue('beatmap_id');
              //  alert(id);    
                 creatButton(id);
            } else{
                alert('URL Error!Please report to the author with the URL');
            }


        }else if(isS===-1 && isB===-1 && isP >-1){
         console.log('beat');
            GM_setValue('beatmap_id',str.substring(31,fff));
            var id = GM_getValue('beatmap_id');
            creatButton(id);
        }else {
            alert('URL Error!Please report to the author with the URL');
        }




        //alert(id);




    }


    function creatButton(id){
        var add_html ="<button id='blood_bt' style='float:left;top:0;width:180px;height:43px;background-color:red;color:white;'>bloodCat</button>";        
        var div = document.createElement("div");
        div.innerHTML = add_html;
        document.getElementsByClassName('paddingboth')[0].append(div);
        document.getElementById('blood_bt').addEventListener("click", function(){window.open("http://bloodcat.com/osu/?q="+id+"&c=b&s=&m=");});

    }




    function getTitle(){
        //Get song name
        var title=document.getElementById("songinfo").getElementsByClassName("colour")[3].getElementsByTagName("a")[0].innerHTML;

        //creat a button element to bloodcat
        creatButton(title);


    }



    //script in bloodcat
    if(bool_cat)
    {
        if(GM_getValue('OSU_enable')==="true"){
            verify();
        }
        GM_setValue('OSU_enable',"false");
    }


    //check have the same beatmap in bloodcat
    function verify(){
        //get length of sets
        var set_num = document.getElementsByClassName('set').length;
        var sameBeatmap='';

        var id = GM_getValue('beatmap_id');


        //alert(id);
        if(set_num===0){
            alert('The beatmap have not exist!');

        }
        //check same id
        for(var i=0;i<set_num;i++){
            sameBeatmap = document.getElementsByTagName('main')[0].getElementsByClassName('set')[i].getElementsByClassName('title')[0].getAttribute('href');
            var cut=sameBeatmap.substring(2);
            if(cut === id){
                // alert("success");
                document.getElementsByTagName('main')[0].getElementsByClassName('set')[i].getElementsByClassName('title')[0].click();
            }
        }

        if(str.indexOf(id)!== -1){
            if(set_num==1)
            {
                document.getElementsByClassName('title')[1].click();

            }
        }
    }
})();
