let site_name = "石头少年";
let github_user = "Garbrandt";
let github_repo = "Garbrandt.github.io";
let per_page = 6;
let nickname = "石头少年";
let profession = "程序员";
let qrcode = "https://u.wechat.com/MBZ5MHdri3A0ipdEEZXlduc";
let github_location = "杭州";
let github_phone = "手机没交费";
let github_motto = "Do what you love,Love what you do.";
let github_about = "我知道你也不想知道";


(function ($) {
    "use strict";

    function mobileMenuHide() {
        let windowWidth = $(window).width(), siteHeader = $('#site_header');
        if (windowWidth < 1025) {
            siteHeader.addClass('mobile-menu-hide');
            $('.menu-toggle').removeClass('open');
            setTimeout(function () {
                siteHeader.addClass('animate');
            }, 500);
        } else {
            siteHeader.removeClass('animate');
        }
    }

    $(window).on('load', function () {
        $(".preloader").fadeOut(800, "linear");
        var ptPage = $('.animated-sections');
        if (ptPage[0]) {
            PageTransitions.init({menu: 'ul.main-menu',});
        }
    }).on('resize', function () {
        mobileMenuHide();
        $('.animated-section').each(function () {
            $(this).perfectScrollbar('update');
        });
        // customScroll();
    });
    $(document).on('ready', function () {
        var movementStrength = 23;
        var height = movementStrength / $(document).height();
        var width = movementStrength / $(document).width();
        $("body").on('mousemove', function (e) {
            var pageX = e.pageX - ($(document).width() / 2), pageY = e.pageY - ($(document).height() / 2),
                newvalueX = width * pageX * -1, newvalueY = height * pageY * -1, elements = $('.lm-animated-bg');
            elements.addClass('transition');
            elements.css({"background-position": "calc( 50% + " + newvalueX + "px ) calc( 50% + " + newvalueY + "px )",});
            setTimeout(function () {
                elements.removeClass('transition');
            }, 300);
        })
        $('.menu-toggle').on("click", function () {
            $('#site_header').addClass('animate');
            $('#site_header').toggleClass('mobile-menu-hide');
            $('.menu-toggle').toggleClass('open');
        });
        $('.main-menu').on("click", "a", function (e) {
            console.log("也是")
            mobileMenuHide();
        });
        $('.sidebar-toggle').on("click", function () {
            $('#blog-sidebar').toggleClass('open');
        });

        var $container = $(".blog-masonry");
        $container.imagesLoaded(function () {
            $container.masonry();
        });
        // customScroll();
        $('.text-rotation').owlCarousel({
            loop: true,
            dots: false,
            nav: false,
            margin: 0,
            items: 1,
            autoplay: true,
            autoplayHoverPause: false,
            autoplayTimeout: 3800,
            animateOut: 'animated-section-scaleDown',
            animateIn: 'animated-section-scaleUp'
        });
        $(".testimonials.owl-carousel").imagesLoaded(function () {
            $(".testimonials.owl-carousel").owlCarousel({
                nav: true,
                items: 3,
                loop: false,
                navText: false,
                autoHeight: true,
                margin: 25,
                responsive: {0: {items: 1,}, 480: {items: 1,}, 768: {items: 2,}, 1200: {items: 2,}}
            });
        });
        $(".clients.owl-carousel").imagesLoaded().owlCarousel({
            nav: true,
            items: 2,
            loop: false,
            navText: false,
            margin: 10,
            autoHeight: true,
            responsive: {0: {items: 2,}, 768: {items: 4,}, 1200: {items: 5,}}
        });
        $('.form-control').val('').on("focusin", function () {
            $(this).parent('.form-group').addClass('form-group-focus');
        }).on("focusout", function () {
            if ($(this).val().length === 0) {
                $(this).parent('.form-group').removeClass('form-group-focus');
            }
        });

        const api_host = 'https://api.github.com'

        new Vue({
            el: '#wrapper',
            data: {
                site_name: site_name,
                nickname: nickname,
                profession: profession,
                qrcode: new QRious({size: 80}),
                per_page: per_page,
                user: github_user,
                repo: github_repo,
                items: [],
                page: 0,
                labels: [],
                isReading: false,
                content: null,
                render: true,
                location: github_location,
                phone: github_phone,
                motto: github_motto,
                about: github_about,
            },
            components: {},
            created() {
                this.getPostList()
                this.getPostLabels()
            },
            mounted() {
            },
            methods: {
                init() {
                    document.title = this.site_name;
                    console.log("hello world")
                },
                getPostList() {
                    this.page = this.page + 1
                    let link = api_host + `/repos/${this.user}/${this.repo}/issues`
                    axios.get(link, {
                        params: {
                            page: this.page,
                            per_page: this.per_page,
                            creator: this.user,
                        }
                    }).then(res => {
                        console.log(res.data)
                        this.items = res.data
                    }).catch(err => {
                        console.log(err)
                    })
                },
                showBlogDetail(item) {
                    console.log(item)
                    this.getPostDetail(item.number)
                },
                getPostDetail(number) {
                    let link = api_host + `/repos/${this.user}/${this.repo}/issues/${number}`
                    axios.get(link, {params: {answer: 42}}).then(res => {
                        this.content = res.data
                        console.log("222", this.content)
                        this.isReading = true
                    }).catch(err => {
                        console.log(err)
                    })
                },
                getPostDetailComments(param) {
                    let link = api_host + `/repos/${param.user}/${param.repo}/issues/${param.post_id}/comments}`
                    axios.get(link, {params: {answer: 42}}).then(res => {

                    }).catch(err => {
                        console.log(err)
                    })
                },
                getPostLabels() {
                    let link = api_host + `/repos/${this.user}/${this.repo}/labels`
                    axios.get(link).then(res => {
                        console.log(res.data)
                        this.labels = res.data
                    }).catch(err => {
                        console.log(err)
                    })
                },
                endReading: function () {
                    this.isReading = false
                    this.content = null
                    this.render = false
                    this.render = true
                },
                compiledMarkdown: function (val) {
                    return marked(val);
                }
            },
            computed: {
                newQRCode() {
                    this.qrcode.value = qrcode;
                    return this.qrcode.toDataURL();
                },
            },
            filters: {
                formatDate(val) {
                    return gettime(val);
                    // 这里用到了moment.js
                },
                formatLabels(val) {
                    console.log("---", val)
                    return ["vuejs"];
                },
                getThumbnail(str) {
                    console.log("获取封面")
                    const regex = /http?s?:?\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg)/;
                    let m;

                    if ((m = regex.exec(str)) !== null) {
                        // The result can be accessed through the `m`-variable.
                        for (let el of m) {
                            console.log(el);
                            return el
                        }
                    }

                    return "img/blog/blog_post_1.jpg"
                },
            }
        })
    });
})(jQuery);

function gettime(createtime) {
    console.log(createtime)
    createtime = Date.parse(createtime);
    let now = Date.parse(new Date()) / 1000;
    let limit = now - createtime / 1000;
    console.log(createtime)
    let content = "";
    if (limit < 60) {
        content = "刚刚";
    } else if (limit >= 60 && limit < 3600) {
        content = Math.floor(limit / 60) + "分钟前";
    } else if (limit >= 3600 && limit < 86400) {
        content = Math.floor(limit / 3600) + "小时前";
    } else if (limit >= 86400 && limit < 2592000) {
        content = Math.floor(limit / 86400) + "天前";
    } else if (limit >= 2592000 && limit < 31104000) {
        content = Math.floor(limit / 2592000) + "个月前";
    } else {
        content = "很久前";
    }
    return content;
}