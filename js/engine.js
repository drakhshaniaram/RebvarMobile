var xml;
$(document).ready(function () {
    $.ajax({
		url:'http://09359405555.ir/app_manager/request_get_cat_arts.php',
		type:"POST",
		
		beforeSend: function(){
			$("#loading").fadeIn().html("<div><h4><img src='img/loading.gif' />  لطفاً تا دریافت اطلاعات صبر نمایید </h4></div>");
			},
		complete: function(){
			$("#loading").fadeOut();
			},	
		success: function(data){
			XMLParser(data)
			},
		error: function(err){
			alert("با عرض پوزش، مشکلی در ارتباط با سرور رخ داده است. لطفاً وضعیت اتصال اینترنت خود را چک کنید. یا اینکه مطمئن شوید که VPN روی دستگاهتان نصب نیست.")},
    });
});
//loading XML file and parsing it to .main div.
function XMLParser(data) {
    xml = data;
    // Create an CAT_OBJECT for collect xml informations.
    var CAT_OBJECT = new Object();
    CAT_OBJECT.Categorys = new Array();
    CAT_OBJECT.Articles = new Array();
    CAT_OBJECT.Comments = new Array();
    CAT_OBJECT.Answers = new Array();

    $(xml).find("category").each(function () { // <category>
        var cat_id = $(this).attr("id");
        var cat_name = $(this).attr("name");
        var cat_date = $(this).attr("date");
        var cat_picturepath = $(this).attr("picture_path");
        var cat_has_title = $(this).attr("has_title");
        CAT_OBJECT.Categorys.push({
            id: cat_id,
            name: cat_name,
            date: cat_date,
            picpath: cat_picturepath,
            has_title: cat_has_title
        });

        $(this).find("article").each(function () { // <article>
            var art_id = $(this).attr("id");
            var art_title = $(this).attr("title");
            var art_text = htmlDeEntities($(this).attr("text"));
            var art_date = $(this).attr("date");
            var art_picturepath = $(this).attr("picture_path");
            var art_catid = $(this).attr("article_category_id");
            CAT_OBJECT.Articles.push({
                id: art_id,
                cat_id: art_catid,
                title: art_title,
                text: art_text,
                date: art_date,
                picpath: art_picturepath
            });

            $(this).find("comment").each(function () { // <comment>
                var comm_id = $(this).attr("id");
                var comm_date = $(this).attr("date");
                var comm_text = htmlDeEntities($(this).attr("text"));
                var comm_status = $(this).attr("status");
                var comm_user_id = $(this).attr("user_id");
                var comm_user_name = $(this).attr("user_name");
                var comm_user_family = $(this).attr("user_family");
                CAT_OBJECT.Comments.push({
                    id: comm_id,
                    cat_id: art_catid,
                    art_id: art_id,
                    text: comm_text,
                    date: comm_date,
                    user_id: comm_user_id,
                    user_name: comm_user_name,
                    user_family: comm_user_family
                });

                $(this).find("answer").each(function () { // <answer>
                    var answ_id = $(this).attr("id");
                    var answ_date = $(this).attr("date");
                    var answ_text = $(this).attr("text");
                    CAT_OBJECT.Answers.push({
                        id: answ_id,
                        comm_id: comm_id,
                        text: answ_text,
                        date: answ_date,
                    });
                }); // </answer>
            }); // </comment>
        }); //</article>

    }); // </category>

    // Generate HTML
    var content = "";
    var list2 = "";
    var comments = "";
	var comments_of_list2 = "";
    var answer = "";
	var answer_of_list2 = "";
    var page_of_list2 = "";
    $(CAT_OBJECT.Categorys).each(function (index, cat_element) {
        $("#category_list").append("<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-li-has-thumb'><a href='#page_of_cat_" + cat_element.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'><img src='" + cat_element.picpath + "' class='ui-li-thumb list_img' onError=\"this.onerror=null;this.src='/img/no_image.png'\" /><h3 class='ui-li-heading'>" + cat_element.name + "</h3><span class=;ui-icon ui-icon-arrow-r ui-icon-shadow;>&nbsp;</span></a></li>");
        $("#category_list").listview("refresh");
        if (Number(cat_element.has_title) == 0) { // ساخت تک صفحه بدون لیست عنوان
            $(CAT_OBJECT.Articles).each(function (index, art_element) {
                if (art_element.cat_id == cat_element.id) {
                    //console.log(art_element.text)
                    // تولید عناوین و توضیحات هر مطلب برای تک صفحه
                    $(CAT_OBJECT.Comments).each(function (index, comm_element) {
                        if (comm_element.art_id == art_element.id) {

                            $(CAT_OBJECT.Answers).each(function (index, answ_element) {
                                if (answ_element.comm_id == comm_element.id) {
                                    answer = answ_element.text;
                                }
                            });
							comments += "<strong class='comm_user_info'><img src='img/user.png' class='user-img' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + comm_element.user_name + " " + comm_element.user_family + "</strong><p class='comm_text'>" + comm_element.text + "</p><strong class='answ_title'><img src='img/enter.png' class='enter-img' /><img src='img/admin.png' class='admin-img' />پاسخ: </strong><span class='answ_text'>" + answer + "</span><p class='seprator'></p>";
                        }
                        
                    });
                    content += "<div data-theme='a' data-form='ui-body-a' class='ui-body ui-body-a ui-corner-all'><p><img src='" + art_element.picpath + "' class='imgHeader_in_pages img-circle' onError=\"this.onerror=null;this.src='/img/no_image.png';\" /><div class='art_body'><h3>" + art_element.title + "</h3><p>" + htmlDeEntities(art_element.text) + "</p></div></p><div data-role='collapsible' data-theme='b' data-content-theme='b' data-iconpos='left' class='comment_coll_wrap'><h4>نظرات شما</h4><p id='comment_form_" + art_element.id + "'><input type='text' placeholder='نام و نام خانوادگی' id='comm_user_name_family_" + art_element.id + "' required/><br><textarea placeholder='متن نظر' id='comm_text_area_" + art_element.id + "' required></textarea><input type='button' value='ارسال نظر' class='send_comm_btn' data-art-id='" + art_element.id + "' data-cat-id='" + art_element.cat_id + "' onclick='var art_id=Number($(this).data(\"art-id\")); var text= $(\"#comm_text_area_\"+art_id).text(); var cat_id = Number($(this).data(\"cat-id\")); var comm_user_name = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[0];var comm_user_family = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[1]; var comm_text = $(\"#comm_text_area_\"+art_id).val(); send2Server(art_id, cat_id, comm_user_name, comm_user_family, comm_text)'/></p><div class='old_comments_content'><div id='new_comment_submited_" + art_element.id + "'></div>" + comments + "</div></div></div>";
                }
				comments="";
            });
            // تولید و چسباندن تک صفحه ی مطلب
            $("body").append("<div id='page_of_cat_" + cat_element.id + "' data-role='page'><div data-role='header' data-fullscreen='true'><a data-iconpos='notext' data-role='button' data-icon='home' title='صفحه اصلی' href='#mainPage'>صفحه اصلی</a><h1>" + cat_element.name + "</h1><a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a></div><div data-role='content'>" + content + "</div></div>");
        } else { // ساختن صفحه ی لیست عنوان + صفحه ی توضیحات
            $(CAT_OBJECT.Articles).each(function (index, art_element) {
                if (art_element.cat_id == cat_element.id) {
                    $(CAT_OBJECT.Comments).each(function (index, comm_element) {
                        if (comm_element.art_id == art_element.id) {

                            $(CAT_OBJECT.Answers).each(function (index, answ_element) {
                                if (answ_element.comm_id == comm_element.id) {
                                    answer_of_list2 = answ_element.text;
                                }
                            });
							comments_of_list2 += "<h4 class='comm_user_info'><img src='img/user.png' class='user-img' onError=\"this.onerror=null;this.src='/img/no_image.png';\" />" + comm_element.user_name + " " + comm_element.user_family + "</h4><p class='comm_text'>" + comm_element.text + "</p><strong class='answ_title'><img src='img/enter.png' class='enter-img' /><img src='img/admin.png' class='admin-img' />پاسخ: </strong><span class='answ_text'>" + answer_of_list2 + "</span><p class='seprator'></p>";
                        }
                    });

                    //تولید آیتم های لیست
                    list2 += "<li data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='c' class='ui-li-has-thumb'><a href='#page_of_art_" + art_element.id + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'><img src='" + art_element.picpath + "' class='ui-li-thumb list_img img-circle' onError=\"this.onerror=null;this.src='/img/no_image.png';\" /><h3 class='ui-li-heading'>" + art_element.title + "</h3><span class=;ui-icon ui-icon-arrow-r ui-icon-shadow;>&nbsp;</span></a></li>"
                    // تولید کد صفحه ی توضیح به ازای هر آیتم
                    page_of_list2 += "<div id='page_of_art_" + art_element.id + "' data-role='page'><div data-role='header' data-fullscreen='true'><a data-iconpos='notext' data-role='button' data-icon='arrow-l' title='صفحه قبلی' href='#page_of_cat_" + cat_element.id + "'>صفحه اصلی</a><h1>" + art_element.title + "</h1><a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a></div><div data-role='content'><div data-theme='a' data-form='ui-body-a' class='ui-body ui-body-a ui-corner-all'><p><img src='" + art_element.picpath + "' class='imgHeader_in_pages' onError=\"this.onerror=null;this.src='/img/no_image.png';\" /><p class='singleArtContent'>" + htmlDeEntities(art_element.text) + "</p></p><div data-role='collapsible' data-theme='b' data-content-theme='b' data-iconpos='left' class='comment_coll_wrap'><h4>نظرات شما</h4><p id='comment_form_" + art_element.id + "'><input type='text' placeholder='نام و نام خانوادگی' id='comm_user_name_family_" + art_element.id + "' required/><br><textarea placeholder='متن نظر' id='comm_text_area_" + art_element.id + "' required></textarea><input type='button' value='ارسال نظر' class='send_comm_btn' data-art-id='" + art_element.id + "' data-cat-id='" + art_element.cat_id + "' onclick='var art_id=Number($(this).data(\"art-id\")); var text= $(\"#comm_text_area_\"+art_id).text(); var cat_id = Number($(this).data(\"cat-id\")); var comm_user_name = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[0];var comm_user_family = $(\"#comm_user_name_family_\"+art_id).val().split(\" \")[1]; var comm_text = $(\"#comm_text_area_\"+art_id).val(); send2Server(art_id, cat_id, comm_user_name, comm_user_family, comm_text)'/></p><div class='old_comments_content'><div id='new_comment_submited_" + art_element.id + "'></div>" + comments_of_list2 + "</div></div></div></div></div>";
                }
				comments_of_list2="";
            });
            // ساخت لیستی که قرار است آیتم ها را درون آن قرار دهیم
            var art_ul = "<ul data-role='listview' data-inset='true'>" + list2 + "</div>";
            // چسباندن کد صفحه لیست به بدنه صفحه
            $("body").append("<div id='page_of_cat_" + cat_element.id + "' data-role='page'><div data-role='header' data-fullscreen='true'><a data-iconpos='notext' data-role='button' data-icon='home' title='صفحه اصلی' href='#mainPage'>صفحه اصلی</a><h1>" + cat_element.name + "</h1><a data-iconpos='notext' href='' data-role='button'data-icon='grid'></a></div><div data-role='content'>" + art_ul + "</div></div>");
            // چسباندن کد صفحه توضیح به بدنه صفحه
            $("body").append(page_of_list2);
        } //آخر شرط اینکه  مطالب عنوان داشته باشند
    }); //آخر حلقه ی تولید دسته بندی ها
}

function htmlDeEntities(str) {
    var decoded = $("<div/>").html(str).text();
    return decoded;
}

function send2Server(art_id, cat_id, user_name, user_family, textval) {
    console.log(art_id + " " + cat_id + " " + user_name + " " + user_family + " " + textval);
    $.ajax({
        url: "http://09359405555.ir/app_manager/request_submit_comment.php",
        type: "POST",
        data: {
            user_name: user_name,
            user_family: user_family,
            user_phone: "",
            text: textval,
            art_id: art_id,
            cat_id: cat_id,
            user_status: "new"
        },
        success: function (resp) {
            $("#comment_form_" + art_id).slideUp();
            $("#new_comment_submited_" + art_id).html(resp);
        },
        error: function (err) {
            $("#new_comment_submited_" + art_id).html(err);
        }
    })
}