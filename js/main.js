let site_name = "石头少年";
let github_user = "Garbrandt";
let github_repo = "Garbrandt.github.io";
let per_page = 6;
let nickname = "石头少年";
let profession = "程序员";

(function ($) {
    "use strict";

    function portfolio_init() {
        var portfolio_grid = $('.portfolio-grid'), portfolio_filter = $('.portfolio-filters');
        if (portfolio_grid) {
            portfolio_grid.shuffle({speed: 450, itemSelector: 'figure'});
            portfolio_filter.on("click", ".filter", function (e) {
                portfolio_grid.shuffle('update');
                e.preventDefault();
                $('.portfolio-filters .filter').parent().removeClass('active');
                $(this).parent().addClass('active');
                portfolio_grid.shuffle('shuffle', $(this).attr('data-group'));
            });
        }
    }

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

    function customScroll() {
        var windowWidth = $(window).width();
        if (windowWidth > 1024) {
            $('.animated-section, .single-page-content').each(function () {
                $(this).perfectScrollbar();
            });
        } else {
            $('.animated-section, .single-page-content').each(function () {
                $(this).perfectScrollbar('destroy');
            });
        }
    }

    $(function () {
        $('#contact_form').validator();
        $('#contact_form').on('submit', function (e) {
            if (!e.isDefaultPrevented()) {
                var url = "contact_form/contact_form.php";
                $.ajax({
                    type: "POST", url: url, data: $(this).serialize(), success: function (data) {
                        var messageAlert = 'alert-' + data.type;
                        var messageText = data.message;
                        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                        if (messageAlert && messageText) {
                            $('#contact_form').find('.messages').html(alertBox);
                            $('#contact_form')[0].reset();
                        }
                    }
                });
                return false;
            }
        });
    });
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
            mobileMenuHide();
        });
        $('.sidebar-toggle').on("click", function () {
            $('#blog-sidebar').toggleClass('open');
        });
        var $portfolio_container = $(".portfolio-grid");
        $portfolio_container.imagesLoaded(function () {
            portfolio_init(this);
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
        $('body').magnificPopup({
            delegate: 'a.lightbox',
            type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
            image: {titleSrc: 'title', gallery: {enabled: true},},
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' +
                    '<div class="mfp-close"></div>' +
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                    '<div class="mfp-title mfp-bottom-iframe-title"></div>' +
                    '</div>',
                patterns: {
                    youtube: {index: 'youtube.com/', id: null, src: '%id%?autoplay=1'},
                    vimeo: {index: 'vimeo.com/', id: '/', src: '//player.vimeo.com/video/%id%?autoplay=1'},
                    gmaps: {index: '//maps.google.', src: '%id%&output=embed'}
                },
                srcAction: 'iframe_src',
            },
            callbacks: {
                markupParse: function (template, values, item) {
                    values.title = item.el.attr('title');
                }
            },
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
                getPostDetail(param) {
                    let link = api_host + `/repos/${this.user}/${this.repo}/issues/${param.post_id}`
                    axios.get(link, {params: {answer: 42}}).then(res => {

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
                    console.log("----")
                    this.isReading = false
                },
            },
            computed: {
                newQRCode() {
                    this.qrcode.value = "hello";
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
                }
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