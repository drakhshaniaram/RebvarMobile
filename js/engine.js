var xml;
var server_url = "http://09359405555.ir/app_manager";
//var server_url = "http://localhost/RebvarDBM/";
// _________________________________________  HTML Decoder  ________________________________________________________
function htmlDeEntities(str) {
   var decoded = $("<div/>").html(str).text();
   return decoded;
}
//_________________________ loading XML file and parsing insert it to an object _______________________________________
function XMLParser(data) {
   xml = data;
   // Create an CAT_OBJECT for collect xml informations.
   var CAT_OBJECT = {};
   CAT_OBJECT.Categorys = [];
   CAT_OBJECT.Articles = [];
   CAT_OBJECT.Comments = [];
   CAT_OBJECT.Answers = [];

   $(xml).find("category").each(function () { // <category>
      var cat_id = $(this).attr("id"),
         cat_name = $(this).attr("name"),
         cat_date = $(this).attr("date"),
         cat_picturepath = $(this).attr("picture_path"),
         cat_has_title = $(this).attr("has_title");
      CAT_OBJECT.Categorys.push({
         id: cat_id,
         name: cat_name,
         date: cat_date,
         picpath: cat_picturepath,
         has_title: cat_has_title
      });

      $(this).find("article").each(function () { // <article>
         var art_id = $(this).attr("id"),
            art_title = $(this).attr("title"),
            art_text = htmlDeEntities($(this).attr("text")),
            art_date = $(this).attr("date"),
            art_picturepath = $(this).attr("picture_path"),
            art_catid = $(this).attr("article_category_id");
         CAT_OBJECT.Articles.push({
            id: art_id,
            cat_id: art_catid,
            title: art_title,
            text: art_text,
            date: art_date,
            picpath: art_picturepath
         });

         $(this).find("comment").each(function () { // <comment>
            var comm_id = $(this).attr("id"),
               comm_date = $(this).attr("date"),
               comm_text = htmlDeEntities($(this).attr("text")),
               comm_status = $(this).attr("status"),
               comm_user_id = $(this).attr("user_id"),
               comm_user_name = $(this).attr("user_name"),
               comm_user_family = $(this).attr("user_family");
            CAT_OBJECT.Comments.push({
               id: comm_id,
               cat_id: art_catid,
               art_id: art_id,
               text: comm_text,
               date: comm_date,
               user_id: comm_user_id,
               user_name: comm_user_name,
               user_family: comm_user_family,
               status: comm_status
            });
            $(this).find("answer").each(function () { // <answer>
               var answ_id = $(this).attr("id"),
                  answ_date = $(this).attr("date"),
                  answ_text = $(this).attr("text");
               CAT_OBJECT.Answers.push({
                  id: answ_id,
                  comm_id: comm_id,
                  text: answ_text,
                  date: answ_date
               });
            }); // </answer>
         }); // </comment>
      }); //</article>

   }); // </category>

   // ______________________________  Generate HTML  ___________________________________________________
   var content = "",
      list2 = "",
      comments = "",
      comments_of_list2 = "",
      answer = "",
      answer_of_list2 = "",
      page_of_list2 = "";
   $(CAT_OBJECT.Categorys).each(function (cat_index, cat_element) {
      $("#category_list").append(	"<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-li-has-thumb'>"+
					 				"<a href='#page_of_cat_" + cat_element.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>"+
										"<img src='" + cat_element.picpath + "' class='ui-li-thumb list_img' onError=\"this.onerror=null;this.src='/img/no_image.png'\" />"+
										"<h3 class='ui-li-heading'>" + cat_element.name + "</h3>"+
										"<span class=;ui-icon ui-icon-arrow-r ui-icon-shadow;>&nbsp;</span>"+
										"</a>"+
					 				"</li>");
	  //_____________________________________________مطالب تک صفحه  ____________________________________________
      if (Number(cat_element.has_title) === 0) { // ساخت تک صفحه بدون لیست عنوان

         $(CAT_OBJECT.Articles).each(function (art_index, art_element) {
            if (art_element.cat_id == cat_element.id) {
               // تولید عناوین و توضیحات هر مطلب برای تک صفحه
               $(CAT_OBJECT.Comments).each(function (comm_index, comm_element) {
                  if (comm_element.art_id == art_element.id) {
                     if (Number(comm_element.status) == 1) {
                        $(CAT_OBJECT.Answers).each(function (answ_index, answ_element) {
                           if (answ_element.comm_id == comm_element.id) {
                              answer = answ_element.text;
                           }
                        });//انتهای استخراج جواب ها
                     }
					 // ساخت متن نظرات و پاسخ ها
                     comments += "<strong class='comm_user_info'>"+
					 				"<img src='img/user.png' class='user-img' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + 
									comm_element.user_name + " " + 
									comm_element.user_family + 
								 "</strong>"+
								 "<p class='comm_text'>" + 
									comm_element.text + 
								 "</p>"+
								 "<strong class='answ_title'>"+
									"<img src='img/enter.png' class='enter-img' />"+
									"<img src='img/admin.png' class='admin-img' />"+
									"پاسخ: "+
								 "</strong>"+
								 "<span class='answ_text'>" + 
									answer + 
								 "</span>"+
								 "<p class='seprator'></p>";
                  }
               }); // انتهای استخراج نظرات
			   // ساخت کل مطلب -  یکی یکی اضافه کردن به متغییری 
               content += "<!--مطلب تک صفحه ای "+art_index+"-->"+"<div data-theme='a' data-form='ui-body-a' class='ui-body ui-body-a ui-corner-all'>"+
								"<p>"+
									"<img src='" + art_element.picpath + "' class='imgHeader_in_pages img-circle' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />"+
									"<div class='art_body'>" + 
										"<h3>" + 
											art_element.title + 
										"</h3>" + 
										"<p>" + 
											htmlDeEntities(art_element.text) + 
										"</p>"+
									"</div>"+
								"</p>"+
								"<div data-role='collapsible' data-theme='b' data-content-theme='b' data-iconpos='left' class='comment_coll_wrap'>"+
									"<h4>نظرات شما</h4>"+
									"<p id='comment_form_" + art_element.id + "'>"+
										"<input type='text' placeholder='نام و نام خانوادگی' id='comm_user_name_family_" + art_element.id + "' required/>"+
										"<br />"+
										"<textarea placeholder='متن نظر' id='comm_text_area_" + art_element.id + "' required='required'>"+"</textarea>"+
										"<input type='button' value='ارسال نظر' class='send_comm_btn' data-art-id='" + art_element.id + 
										"' data-cat-id='" + art_element.cat_id + 
										"' onclick='"+
												"var art_id=Number($(this).data(\"art-id\")); "+
												"var text= $(\"#comm_text_area_\"+art_id).text(); "+
												"var cat_id = Number($(this).data(\"cat-id\")); "+
												"var comm_user_name = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[0];"+
												"var comm_user_family = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[1]; "+
												"var comm_text = $(\"#comm_text_area_\"+art_id).val(); "+
												"send2Server(art_id, cat_id, comm_user_name, comm_user_family, comm_text);'"+
										"/>"+
									"</p>"+
									"<div class='old_comments_content'>" + 
										"<div id='new_comment_submited_" + art_element.id + "'>"+
										comments + 
									"</div>" + 
								"</div>" +
								"</div>" + 
								"</div>";
            }
			comments="";
         }); //انتهای استخراج مطالب
		 
         // و سپس چسباندن تک صفحه ی مطلب به بدنه صفحه
         $("body").append(	"<div id='page_of_cat_" + cat_element.id + "' data-role='page'>" + 
									"<div data-role='header' data-fullscreen='true'>" + 
										"<a data-iconpos='notext' data-role='button' data-icon='home' title='صفحه اصلی' href='#mainPage'>صفحه اصلی</a>" + 
										"<h1>" + cat_element.name + "</h1>" + 
										"<a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a>" + 
									"</div>" + 
									"<div data-role='content'>" + content + "</div>" + 
								"</div>");
		 //_________________________________________ مطالب لیست-صفحه ای____________________________________________
      } else { // ساختن صفحه ی لیست عنوان + صفحه ی توضیحات
         $(CAT_OBJECT.Articles).each(function (index, art2_element) {
            if (art2_element.cat_id == cat_element.id) {
               $(CAT_OBJECT.Comments).each(function (index, comm2_element) {
                  if (comm2_element.art_id == art2_element.id) {

                     $(CAT_OBJECT.Answers).each(function (index, answ2_element) {
                        if (answ2_element.comm_id == comm2_element.id) {
                           answer_of_list2 = answ2_element.text;
                        }
                     });
                     comments_of_list2 +=   "<h4 class='comm_user_info'>" + 
												"<img src='img/user.png' class='user-img' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + comm2_element.user_name + " " + comm2_element.user_family + 
											"</h4>" + 
											"<p class='comm_text'>" + comm2_element.text + "</p>" + 
											"<strong class='answ_title'>" + 
												"<img src='img/enter.png' class='enter-img' />" + 
												"<img src='img/admin.png' class='admin-img' />پاسخ: " + 
											"</strong>" + 
											"<span class='answ_text'>" + answer_of_list2 + "</span>" + 
											"<p class='seprator'></p>";
                  }
               });

               //تولید آیتم های لیست
               list2 += 			"<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-li-has-thumb'>" + 
										"<a href='#page_of_art_" + art2_element.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + 
											"<img src='" + art2_element.picpath + "' class='ui-li-thumb list_img img-circle' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + 
											"<h3 class='ui-li-heading'>" + art2_element.title + "</h3>" + 
											"<span class=;ui-icon ui-icon-arrow-r ui-icon-shadow;>&nbsp;</span>" + 
										"</a>" + 
									"</li>";
               // تولید کد صفحه ی توضیح به ازای هر آیتم
               page_of_list2 += "<div id='page_of_art_" + art2_element.id + "' data-role='page'>" + 
										"<div data-role='header' data-fullscreen='true'>" + 
											"<a data-iconpos='notext' data-role='button' data-icon='arrow-l' title='صفحه قبلی' href='#page_of_cat_" + cat_element.id + "'>صفحه اصلی</a>" + 
											"<h1>" + art2_element.title + "</h1>" + 
											"<a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a>" + 
										"</div>" + 
										"<div data-role='content'>" + 
											"<div data-theme='a' data-form='ui-body-a' class='ui-body ui-body-a ui-corner-all'>" + 
												"<p>" + 
													"<img src='" + art2_element.picpath + "' class='imgHeader_in_pages' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + 
													"<p class='singleArtContent'>" + htmlDeEntities(art2_element.text) + "</p>" + 
												"</p>" + 
												"<div data-role='collapsible' data-theme='b' data-content-theme='b' data-iconpos='left' class='comment_coll_wrap'>" + 
												"<h4>نظرات شما</h4>" + 
												"<p id='comment_form_" + art2_element.id + "'>" + 
													"<input type='text' placeholder='نام و نام خانوادگی' id='comm_user_name_family_" + art2_element.id + "' required=\"required\"/><br>" + 
													"<textarea placeholder='متن نظر' id='comm_text_area_" + art2_element.id + "'  required=\"required\"></textarea>" + 
													"<input type='button' value='ارسال نظر' class='send_comm_btn' data-art-id='" + art2_element.id + "' data-cat-id='" + art2_element.cat_id + "' " + 
														"onclick='" + 
															"var art_id=Number($(this).data(\"art-id\")); " + 
															"var text= $(\"#comm_text_area_\"+art_id).text(); " + 
															"var cat_id = Number($(this).data(\"cat-id\")); " + 
															"var comm_user_name = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[0];" + 
															"var comm_user_family = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[1]; " + 
															"var comm_text = $(\"#comm_text_area_\"+art_id).val(); " + 
															"send2Server(art_id, cat_id, comm_user_name, comm_user_family, comm_text)" + 
													"'/>" + 
												"</p>" + 
												"<div class='old_comments_content'>" + 
												"<div id='new_comment_submited_" + art2_element.id + "'>" + 
												"</div>" + comments_of_list2 + 
												"</div>" + 
												"</div>" + 
											"</div>" + 
										"</div>" + 
								"</div>";
            }
			comments_of_list2="";
         });
         // ساخت لیستی که قرار است آیتم ها را درون آن قرار دهیم
         var art_ul = "<ul data-role='listview' data-inset='true'>" + list2 + "</div>";
         // چسباندن کد صفحه لیست به بدنه صفحه
         $("body").append(		"<div id='page_of_cat_" + cat_element.id + "' data-role='page'>" + 
									"<div data-role='header' data-fullscreen='true'>" + 
										"<a data-iconpos='notext' data-role='button' data-icon='home' title='صفحه اصلی' href='#mainPage'>صفحه اصلی</a>" + 
										"<h1>" + cat_element.name + "</h1>" + 
										"<a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a>" + 
									"</div>" + 
									"<div data-role='content'>" + art_ul + "</div>" + 
									"</div>");
         // چسباندن کد صفحه توضیح به بدنه صفحه
         $("body").append(page_of_list2);
      } //آخر شرط اینکه  مطالب عنوان داشته باشند
	  // برای هر دسته بندی باید محتوای تولید شده برای دسته بندی قبلی خالی بشود و با مطالب دسته بندی جدید پر شود
	  content="";
	  comments_of_list2 = "";
   }); //آخر حلقه ی تولید دسته بندی ها

}

// _________________________________________  Interaction with Server ______________________________________________


function send2Server(art_id, cat_id, user_name, user_family, textval) {
   user_family = (typeof user_family === "undefined") ? "" : user_family;
   console.log(art_id + " " + cat_id + " " + user_name + " " + user_family + " " + textval);
   $.ajax({
      url: server_url+"/request_submit_comment.php",
      type: "POST",
      data: {
         user_name: user_name,
         user_family: user_family,
         text: textval,
         art_id: art_id,
         cat_id: cat_id,
      },
      success: function (resp) {
         $("#comment_form_" + art_id).slideUp();
         if (Number(resp) === 1) $("#new_comment_submited_" + art_id).html("<div class='alert alert-success'><span class='icon-ok icon-white' style='margin-right:5px;'></span>با تشکر، نظر شما ثبت شده و در اسرع وقت جواب داده خواهد شد.</div>");
         if (Number(resp) === 0) $("#new_comment_submited_" + art_id).html("<div class='alert alert-important>متاسفانه در ثبت نظر شما، مشکلی پیش آمده است، لطفاً با مدیر تماس یگیرید.</div>");
         if (Number(resp) === 2) $("#new_comment_submited_" + art_id).html("<div class='alert alert-important>متاسفانه در ثبت اطلاعات کاربری شما مشکلی پیش آمده است. لطفاً مجدداً تلاش فرمایید.</div>");
      },
      error: function (err) {
         $("#new_comment_submited_" + art_id).html(err);
      }
   });
}
//__________________________________________ Controller function  __________________________________________________
$(document).ready(function () {
   function getContentFromServer() {
      $.ajax({
         url: server_url+'/request_get_cat_arts.php',
         type: "POST",

         beforeSend: function () {
            $("#loading").fadeIn().html("<div><h4><img src='img/loading.gif' />  لطفاً تا دریافت کامل اطلاعات صبر نمایید... </h4></div>");
         },
         complete: function () {
            $("#loading").fadeOut();
         },
         success: function (data) {
            XMLParser(data);
         },
         error: function (err) {
            $("#my_dialog").css("display", "block");
            $.mobile.changePage("#my_dialog", {
               role: "dialog"
            });
            console.log("Error when load xml file: " + err);
         },
      });
   }
   $("#btn_reload").click(function () {
      $("#my_dialog").css("display", "none");
      getContentFromServer();
   });
   $("#btn_cancel").click(function () {
      $("#my_dialog").css("display", "none");
   });
   getContentFromServer();

});