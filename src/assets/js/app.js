$(document).ready(function () {

    $(".select2").select2({
        width: '100%',
        minimumResultsForSearch: -1,
    });

    $(".select2-search").select2({
        width: '100%',
    });

    // siteJS ---------------------------------------

    let siteJS = {
        onload: function() {
            siteJS.init();

            let resizeFlag = false;

            window.addEventListener('resize', () => {
                if(!resizeFlag){
                    resizeFlag = true;
                    setTimeout(() => {
                        this.table();
                        resizeFlag = false;
                    }, 500)
                }
            })
        },
        init() {
            this.typeDisplay();
            this.accordion();
            this.nav();
            this.table();
            this.filters();
        },
        filters(){
            const filterBtn = $('.content-head__filter-btn, .close-filter-panel');
            const filterPanel = $('.filter-panel');

            filterBtn.click(function () {
                if(filterPanel.is(':hidden')){
                    siteJS.helpers.elemSlideDown(filterPanel, 'filter-panel--active');
                    $(this).addClass('content-head__filter-btn--active');
                } else {
                    siteJS.helpers.elemSlideUp(filterPanel, 'filter-panel--active');
                    $(this).removeClass('content-head__filter-btn--active');
                }
            })
        },
        table() {
            const tables = $('.regular-table');

            tables.each(function () {
                const breakpoint = $(this).attr('data-table-breakpoint');
                if(window.matchMedia(`(min-width: ${breakpoint})`).matches){
                    $(this).addClass('regular-table--expaned')
                    $(this).removeClass('regular-table--collapsed')
                } else {
                    $(this).addClass('regular-table--collapsed');
                    $(this).removeClass('regular-table--expaned');
                }
            })
        },
        typeDisplay() {
            if ("ontouchstart" in document.documentElement) {
                document.body.classList.add('touch-device');
            } else {
                document.body.classList.add('hover-device');
            }
        },
        nav(){
            const sidebarNav = $('.main__sidebar');
            const navToggleBtn = $('.header__menu-btn, .sidebar__close');

            navToggleBtn.click(() => {
                if(!sidebarNav.hasClass('main__sidebar--active')){
                    sidebarNav.addClass('main__sidebar--active');
                    $('html, body').addClass('no-overflow');
                } else {
                    sidebarNav.removeClass('main__sidebar--active');
                    $('html, body').removeClass('no-overflow');
                }
            })

            $(document).bind("mouseup touchend", function (e) {
                if (!sidebarNav.is(e.target) && sidebarNav.hasClass('main__sidebar--active') && sidebarNav.has(e.target).length === 0) {
                    sidebarNav.removeClass('main__sidebar--active');
                    $('html, body').removeClass('no-overflow');
                }
            });
        },
        accordion() {
            const accordionWrapper = $('.accordion');
            const togglers = accordionWrapper.find('.accordion__toggle');

            togglers.click((e) => {
                if($(e.target).closest('.accordion__toggle').length || $(e.target) === $(e.currentTarget)){
                    const sub = $(e.currentTarget).next('.accordion__sub');

                    if(sub.length && sub.is(':hidden')){
                        $(e.currentTarget).addClass('accordion__toggle--active');
                        siteJS.helpers.elemSlideDown(sub, 'accordion__sub--active');
                    } else {
                        $(e.currentTarget).removeClass('accordion__toggle--active');
                        siteJS.helpers.elemSlideUp(sub, 'accordion__sub--active');
                    }
                }
            })
        },
        helpers: {
            elemSlideUp(elem, removeClass = '', durationTime = 200){
                $(elem).slideUp({
                    duration: durationTime,
                    done: function () {
                        $(this).removeClass(removeClass).attr('style','');
                    }
                });
            },
            elemSlideDown(elem, addClass = '', durationTime = 200){
                $(elem).slideDown({
                    duration: durationTime,
                    done: function () {
                        $(this).addClass(addClass).attr('style','');
                    }
                });
            },
            elemFadeIn(elem, addClass = '', durationTime = 200){
                $(elem).fadeIn({
                    duration: durationTime,
                    done: function () {
                        $(this).addClass(addClass).attr('style','');
                    }
                });
            },
            elemFadeOut(elem, removeClass = '', durationTime = 200){
                $(elem).fadeOut({
                    duration: durationTime,
                    done: function () {
                        $(this).removeClass(removeClass).attr('style','');
                    }
                });
            },
            elemFadeToggle(elem, toggleClass = '', durationTime = 200){
                $(elem).fadeToggle({
                    duration: durationTime,
                    done: function () {
                        $(this).hasClass(toggleClass)?
                            $(this).removeClass(toggleClass):
                            $(this).addClass(toggleClass);
                        $(this).attr('style','');
                    }
                });
            },
            elemSlideToggle(elem, toggleClass = '', durationTime = 200){
                $(elem).slideToggle({
                    duration: durationTime,
                    done: function () {
                        $(this).hasClass(toggleClass)?
                            $(this).removeClass(toggleClass):
                            $(this).addClass(toggleClass);
                        $(this).attr('style','');
                    }
                });
            }
        }
    };

    siteJS.onload();
});



