/*
 * jGFeed 1.0 - Google Feed API abstraction plugin for jQuery
 *
 * Copyright (c) 2009 jQuery HowTo
 *
 * Licensed under the GPL license:
 *   http://www.gnu.org/licenses/gpl.html
 *
 * URL:
 *   http://jquery-howto.blogspot.com
 *
 * Author URL:
 *   http://me.boo.uz
 *
 */
(function($){$.extend({jGFeed:function(url,fnk,num,key){if(url==null)return!1;var gurl="http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+url;num!=null&&(gurl+="&num="+num),key!=null&&(gurl+="&key="+key),$.getJSON(gurl,function(data){if(typeof fnk!="function")return!1;fnk.call(this,data.responseData.feed)})}})})(jQuery);