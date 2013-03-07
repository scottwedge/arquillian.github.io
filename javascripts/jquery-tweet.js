// jquery.tweet.js - See http://tweet.seaofclouds.com/ or https://github.com/seaofclouds/tweet for more info
// Copyright (c) 2008-2011 Todd Matthews & Steve Purcell
(function($){$.fn.tweet=function(o){function t(template,info){if(typeof template=="string"){var result=template;for(var key in info){var val=info[key];result=result.replace(new RegExp("{"+key+"}","g"),val===null?"":val)}return result}return template(info)}function replacer(regex,replacement){return function(){var returning=[];return this.each(function(){returning.push(this.replace(regex,replacement))}),$(returning)}}function parse_date(date_str){return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i,"$1,$2$4$3"))}function relative_time(date){var relative_to=arguments.length>1?arguments[1]:new Date,delta=parseInt((relative_to.getTime()-date)/1e3,10),r="";return delta<60?r=delta+" seconds ago":delta<120?r="a minute ago":delta<2700?r=parseInt(delta/60,10).toString()+" minutes ago":delta<7200?r="an hour ago":delta<86400?r=""+parseInt(delta/3600,10).toString()+" hours ago":delta<172800?r="a day ago":r=parseInt(delta/86400,10).toString()+" days ago","about "+r}function build_auto_join_text(text){return text.match(/^(@([A-Za-z0-9-_]+)) .*/i)?s.auto_join_text_reply:text.match(url_regexp)?s.auto_join_text_url:text.match(/^((\w+ed)|just) .*/im)?s.auto_join_text_ed:text.match(/^(\w*ing) .*/i)?s.auto_join_text_ing:s.auto_join_text_default}function maybe_https(url){return"https:"==document.location.protocol?url.replace(/^http:/,"https:"):url}function build_api_url(){var proto="https:"==document.location.protocol?"https:":"http:",count=s.fetch===null?s.count:s.fetch;if(s.list)return proto+"//"+s.twitter_api_url+"/1/"+s.username[0]+"/lists/"+s.list+"/statuses.json?page="+s.page+"&per_page="+count+"&callback=?";if(s.favorites)return proto+"//"+s.twitter_api_url+"/favorites/"+s.username[0]+".json?page="+s.page+"&count="+count+"&callback=?";if(s.query===null&&s.username.length==1)return proto+"//"+s.twitter_api_url+"/1/statuses/user_timeline.json?screen_name="+s.username[0]+"&count="+count+(s.retweets?"&include_rts=1":"")+"&page="+s.page+"&callback=?";var query=s.query||"from:"+s.username.join(" OR from:");return proto+"//"+s.twitter_search_url+"/search.json?&q="+encodeURIComponent(query)+"&rpp="+count+"&page="+s.page+"&callback=?"}function extract_template_data(item){var o={};return o.item=item,o.source=item.source,o.screen_name=item.from_user||item.user.screen_name,o.avatar_size=s.avatar_size,o.avatar_url=maybe_https(item.profile_image_url||item.user.profile_image_url),o.retweet=typeof item.retweeted_status!="undefined",o.tweet_time=parse_date(item.created_at),o.join_text=s.join_text=="auto"?build_auto_join_text(item.text):s.join_text,o.tweet_id=item.id_str,o.twitter_base="http://"+s.twitter_url+"/",o.user_url=o.twitter_base+o.screen_name,o.tweet_url=o.user_url+"/status/"+o.tweet_id,o.reply_url=o.twitter_base+"intent/tweet?in_reply_to="+o.tweet_id,o.retweet_url=o.twitter_base+"intent/retweet?tweet_id="+o.tweet_id,o.favorite_url=o.twitter_base+"intent/favorite?tweet_id="+o.tweet_id,o.retweeted_screen_name=o.retweet&&item.retweeted_status.user.screen_name,o.tweet_relative_time=relative_time(o.tweet_time),o.tweet_raw_text=o.retweet?"RT @"+o.retweeted_screen_name+" "+item.retweeted_status.text:item.text,o.tweet_raw_text=o.tweet_raw_text.replace(/^RT /,'<i class="icon-retweet"></i> '),o.tweet_text=$([o.tweet_raw_text]).linkUrl().linkUser().linkHash()[0],o.tweet_text_fancy=$([o.tweet_text]).makeHeart().capAwesome().capEpic()[0],o.user=t('<a class="tweet_user" href="{user_url}">{screen_name}</a>',o),o.join=s.join_text?t(' <span class="tweet_join">{join_text}</span> ',o):" ",o.avatar=o.avatar_size?t('<a class="tweet_avatar" href="{user_url}"><img src="{avatar_url}" height="{avatar_size}" width="{avatar_size}" alt="{screen_name}\'s avatar" title="{screen_name}\'s avatar" border="0"/></a>',o):"",o.time=t('<span class="tweet_time"><a href="{tweet_url}" title="view tweet on twitter">{tweet_relative_time}</a></span>',o),o.text=t('<span class="tweet_text">{tweet_text_fancy}</span>',o),o.reply_action=t('<a class="tweet_action tweet_reply" href="{reply_url}">reply</a>',o),o.retweet_action=t('<a class="tweet_action tweet_retweet" href="{retweet_url}">retweet</a>',o),o.favorite_action=t('<a class="tweet_action tweet_favorite" href="{favorite_url}">favorite</a>',o),o}var s=$.extend({username:null,list:null,favorites:!1,query:null,avatar_size:null,count:3,fetch:null,page:1,retweets:!0,intro_text:null,outro_text:null,join_text:null,auto_join_text_default:"i said,",auto_join_text_ed:"i",auto_join_text_ing:"i am",auto_join_text_reply:"i replied to",auto_join_text_url:"i was looking at",loading_text:null,refresh_interval:null,twitter_url:"twitter.com",twitter_api_url:"api.twitter.com",twitter_search_url:"search.twitter.com",template:"{avatar}{time}{join}{text}",comparator:function(tweet1,tweet2){return tweet2.tweet_time-tweet1.tweet_time},filter:function(tweet){return!0}},o),url_regexp=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;return $.extend({tweet:{t:t}}),$.fn.extend({linkUrl:replacer(url_regexp,function(match){var url=/^[a-z]+:/i.test(match)?match:"http://"+match;return'<a href="'+url+'">'+match+"</a>"}),linkUser:replacer(/@(\w+)/gi,'@<a href="http://'+s.twitter_url+'/$1">$1</a>'),linkHash:replacer(/(?:^| )[\#]+([\w\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0600-\u06ff]+)/gi,' <a href="http://'+s.twitter_search_url+"/search?q=&tag=$1&lang=all"+(s.username&&s.username.length==1&&!s.list?"&from="+s.username.join("%2BOR%2B"):"")+'">#$1</a>'),capAwesome:replacer(/\b(awesome)\b/gi,'<span class="awesome">$1</span>'),capEpic:replacer(/\b(epic)\b/gi,'<span class="epic">$1</span>'),makeHeart:replacer(/(&lt;)+[3]/gi,"<tt class='heart'>&#x2665;</tt>")}),this.each(function(i,widget){var list=$('<ul class="tweet_list">').appendTo(widget),intro='<p class="tweet_intro">'+s.intro_text+"</p>",outro='<p class="tweet_outro">'+s.outro_text+"</p>",loading=$('<p class="loading">'+s.loading_text+"</p>");s.username&&typeof s.username=="string"&&(s.username=[s.username]),s.loading_text&&$(widget).append(loading),$(widget).bind("tweet:load",function(){$.getJSON(build_api_url(),function(data){s.loading_text&&loading.remove(),s.intro_text&&list.before(intro),list.empty();var tweets=$.map(data.results||data,extract_template_data);tweets=$.grep(tweets,s.filter).sort(s.comparator).slice(0,s.count),list.append($.map(tweets,function(o){return"<li>"+t(s.template,o)+"</li>"}).join("")).children("li:first").addClass("tweet_first").end().children("li:odd").addClass("tweet_even").end().children("li:even").addClass("tweet_odd"),s.outro_text&&list.after(outro),$(widget).trigger("loaded").trigger(tweets.length===0?"empty":"full"),s.refresh_interval&&window.setTimeout(function(){$(widget).trigger("tweet:load")},1e3*s.refresh_interval)})}).trigger("tweet:load")})}})(jQuery);