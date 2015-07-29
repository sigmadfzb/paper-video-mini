/**
 * @此专题出自澎湃新闻网，http://thepaper.cn, 
 * @date    2015-07-28 13:55:03
 *By jigl@thepaper.cn
 *制作团队：梁嫣佳，季国亮
 */
(function($){
    "use strict";
    $.fn.paperVideo = function(options){
        var defaults = {
            buffer_color:'',
            progress_color:'',
            timeline_color:''
        };

        var setting = $.extend(true, {}, defaults, options);

        var pv_dom_arr =[];

        function PaperVideoActions(video_dom){
            var _this = this;
            var bufferd = 0, progress = 0, tip_position = 0;
            var controls_width = parseInt(video_dom.pv_controls.css('width'));

            this.init = function(){
                //video events;
                video_dom.video.addEventListener('play',_this.play,false);
                
                video_dom.video.addEventListener('timeupdate',_this.timeupdate,false);
                video_dom.video.addEventListener('ended',_this.ended,false);

                video_dom.pv_ui.on('click',_this.switch_video);
                video_dom.pv_timeline.on('mousemove',_this.show_timeline_tip)
                                    .on('mouseleave',function(){
                                        video_dom.pv_timeline_tip.removeClass('show');
                                    })
                                    .on('click',_this.change_currentTime);
            },
            this.switch_video = function(){
                if(video_dom.video.paused){
                    video_dom.video.play();
                    video_dom.pv_ui.addClass('playing');
                }
                else{
                    video_dom.video.pause();
                    video_dom.pv_ui.removeClass('playing');
                    video_dom.buffering.removeClass('show');
                }
            },
            this.show_timeline_tip = function(){
                var offsetX = event.offsetX;
                video_dom.pv_timeline_tip.addClass('show');

                if(offsetX>=0&&offsetX<=controls_width){
                    video_dom.pv_timeline_tip.css('left',function(){
                        tip_position = offsetX/controls_width;
                        _this.cal_tip_time();
                        return tip_position*100+'%';
                    })
                }
            },
            this.change_currentTime = function(){
                var offsetX = event.offsetX;
                event.stopPropagation();
                if(offsetX>=0&&offsetX<=controls_width){
                    video_dom.video.currentTime = (offsetX/controls_width)*video_dom.video.duration;
                }
            },
            this.cal_tip_time = function(){
                var tip_second = Math.floor(tip_position*video_dom.video.duration);
                var minute = Math.floor(tip_second/60);
                var second = Math.floor(tip_second%60);

                //format the minute and second
                minute = minute<10?'0'+minute:minute;
                second = second<10?'0'+second:second;
                video_dom.pv_timeline_tip.text(minute+':'+second);
            },
            this.play = function(){
                this.addEventListener('progress',_this.buffer,false);
            },
            this.switch_buffering = function(){
                if(video_dom.video.readyState==4){
                    video_dom.buffering.removeClass('show');
                }
                if(video_dom.video.readyState<video_dom.video.HAVE_FUTURE_DATA){
                    video_dom.buffering.addClass('show');
                }
            },
            this.buffer = function(){
                _this.switch_buffering();

                if(this.buffered.length>0){
                    bufferd = _this.format_percent(this.buffered.end(0)/this.duration)*100;
                    video_dom.pv_buffer.css('width',bufferd+'%');
                };
            },
            this.timeupdate = function(){
                _this.switch_buffering();
                progress = _this.format_percent(this.currentTime/this.duration)*100;
                video_dom.pv_progress.css('width',progress+'%');
            },
            this.format_percent = function(value){
                return Math.floor(value*10000)/10000;
            },
            this.ended = function(){
                video_dom.pv_ui.removeClass('playing');
                video_dom.buffering.removeClass('show');
            }

            this.init();

            window.addEventListener('resize',function(){
                controls_width = parseInt(video_dom.pv_controls.css('width'));
            })
        }

        this.each(function(index, ele) {
            /*append dom to video box*/
            var pv_dom = {};
            var paper_video_action;

            pv_dom.pv_ui = $('<div/>').appendTo(ele)
                                .addClass('pv-ui');
            pv_dom.pv_controls = $('<div/>').appendTo(pv_dom.pv_ui)
                                            .addClass('pv-controls');
            pv_dom.pv_timeline = $('<div/>').appendTo(pv_dom.pv_controls)
                                            .addClass('pv-timeline')
                                            .css('background-color',function(){
                                                return setting.timeline_color?setting.timeline_color:false;
                                            });
            pv_dom.pv_buffer = $('<div/>').appendTo(pv_dom.pv_timeline)
                                            .addClass('pv-buffer')
                                            .css('background-color',function(){
                                                return setting.buffer_color?setting.buffer_color:false;
                                            });;
            pv_dom.pv_progress = $('<div/>').appendTo(pv_dom.pv_timeline)
                                            .addClass('pv-progress')
                                            .css('background-color',function(){
                                                return setting.progress_color?setting.progress_color:false;
                                            });;
            pv_dom.pv_timeline_tip = $('<div/>').appendTo(pv_dom.pv_controls)
                                            .addClass('pv-timeline-tip')
                                            .text('00:00');
            pv_dom.buffering = $('<div/>').appendTo(pv_dom.pv_ui)
                                        .addClass('pv-buffering');
            pv_dom.video = $('video',ele)[0];

            paper_video_action = new PaperVideoActions(pv_dom);

            pv_dom_arr.push(paper_video_action);                               
        });

        return this;
    }
})(jQuery);

var $paper_video = $('.paper-video').paperVideo({progress_color:'red'});