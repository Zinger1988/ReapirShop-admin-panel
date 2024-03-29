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
            this.modal();
            this.fileAdd();
        },
        fileAdd() {
            const wrapper = $('.add-file');

            wrapper.each(function () {

                const inputFile = $(this).find('.add-file__input');
                const addFileBtn = $(this).find('.add-file__btn');
                const fileListOutput = $(this).find('.add-file__list');
                const reset = $(this).find('.add-file__clear');

                reset.click(() => {
                    inputFile.value = "";
                    fileListOutput
                        .removeClass('active')
                        .find('.add-file__list-item, .add-file__error')
                        .remove();
                })

                addFileBtn.click(() => inputFile.click());

                inputFile.change(function () {

                    inputFile.value = "";
                    fileListOutput.find('.add-file__list-item, .add-file__error').remove();
                    reset.removeClass('hidden');

                    const filesArr = Array.from(inputFile.get(0).files);
                    const fragment = document.createDocumentFragment();

                    const filesSize = filesArr.reduce((acc, {size}) => {
                        return acc + size
                    }, 0)

                    if(filesSize > 5120000){
                        reset.addClass('hidden');
                        fileListOutput
                            .addClass('active')
                            .append('<div class="add-file__error">File is too big</div>');
                        inputFile.value = "";
                        return;
                    }

                    filesArr.forEach(({name}) => {
                        $(fragment).append(`<div class="add-file__list-item">${name}</div>`);
                    })

                    if(inputFile.val()){
                        fileListOutput.prepend(fragment);
                        fileListOutput.addClass('active');
                    }
                })
            });
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
            const tableInputs = $('.regular-table__cell--mark .checkbox-radio__input');

            function markTableRows(checkboxElem, parentSelector, activeClass){
                if(checkboxElem.prop('checked')){
                    checkboxElem.closest(parentSelector).addClass(activeClass);
                } else {
                    checkboxElem.closest(parentSelector).removeClass(activeClass);
                }
            }

            tableInputs.each(function () {
                markTableRows($(this), '.regular-table__row', 'regular-table__row--marked');
            })

            tableInputs.on('click', function () {
                markTableRows($(this), '.regular-table__row', 'regular-table__row--marked');
            });

            tables.each(function () {

                const markCheckbox = $(this).find('.regular-table__cell--mark .checkbox-radio__input');
                const headCheckbox = $(this).find('.regular-table__row--head .checkbox-radio__input');
                const headCheckboxIndex = headCheckbox.closest('.regular-table__cell').index();

                headCheckbox.on('click', () => {
                    const tableRows = $(this).find('.regular-table__row:not(.regular-table__row--head)');

                    tableRows.each(function () {
                        const tableCell = $(this).find('.regular-table__cell:not(.regular-table__cell--head)').eq(headCheckboxIndex);
                        const input = tableCell.find('.checkbox-radio__input');

                        if(headCheckbox.prop('checked')){
                            input.prop('checked', 'true')
                        } else {
                            input.prop('checked', 'false')
                        }
                    })
                })

                markCheckbox.on('click', markTableRows.bind(null, $(this), '.regular-table__row', 'regular-table__row--marked'));

                const breakpoint = $(this).attr('data-table-breakpoint');
                if(window.matchMedia(`(min-width: ${breakpoint})`).matches){
                    $(this).addClass('regular-table--expaned');
                    $(this).removeClass('regular-table--collapsed');
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
        modal(){
            const modalBtn = $('[data-modal-id]');
            const modal = $('.modal');

            modalBtn.click(function (e) {
                e.preventDefault();
                const modalTarget = '#' + $(this).data('modalId');
                siteJS.helpers.elemFadeIn(modalTarget, 'active');
            });

            modal.click(function (e) {
                if($(e.target).hasClass('close-modal') || $(e.target).closest('.close-modal').not('.modal').length){
                    siteJS.helpers.elemFadeOut($(this), 'active');
                }
            });
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



