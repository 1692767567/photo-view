// eslint-disable-next-line no-undef
$(function () {
  // eslint-disable-next-line no-undef
  $('.off').on('click', function () {
    // eslint-disable-next-line no-undef
    var off = $(this).attr('off')
    // eslint-disable-next-line no-undef
    var chi = $(this).children('i')
    // eslint-disable-next-line no-undef
    var text = $(this).children('span')
    //  eslint-disable-next-line no-undef
    var cont = $(this).parents('.item').siblings('.review-version')
    if (off) {
      //  eslint-disable-next-line no-undef
      $(text).text('展开')
      //  eslint-disable-next-line no-undef
      $(chi).attr('class', 'layui-icon layui-icon-down')
      //  eslint-disable-next-line no-undef
      $(this).attr('off', '')
      //  eslint-disable-next-line no-undef
      $(cont).addClass('layui-hide')
    } else {
      //  eslint-disable-next-line no-undef
      $(text).text('收起')
      //  eslint-disable-next-line no-undef
      $(chi).attr('class', 'layui-icon layui-icon-up')
      //  eslint-disable-next-line no-undef
      $(this).attr('off', 'true')
      //  eslint-disable-next-line no-undef
      $(cont).removeClass('layui-hide')
    }
  })
})
