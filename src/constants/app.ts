/**
 * Mapping of app names to their package names.
 */
export const APP_PACKAGES: Record<string, string> = {
  '微信': 'com.tencent.mm',
  'QQ': 'com.tencent.mobileqq',
  '微博': 'com.sina.weibo',
  '淘宝': 'com.taobao.taobao',
  '京东': 'com.jingdong.app.mall',
  '拼多多': 'com.xunmeng.pinduoduo',
  '美团': 'com.sankuai.meituan',
  '饿了么': 'me.ele',
  '肯德基': 'cn.com.kfc.ekfc',
  '携程': 'ctrip.android.view',
  '12306': 'com.MobileTicket',
  '滴滴出行': 'com.sdu.didi.psnger',
  'bilibili': 'tv.danmaku.bili',
  '抖音': 'com.ss.android.ugc.aweme',
  '爱奇艺': 'com.qiyi.video',
  '网易云音乐': 'com.netease.cloudmusic',
  'QQ音乐': 'com.tencent.qqmusic',
  '喜马拉雅': 'com.ximalaya.ting.android',
  '大众点评': 'com.dianping.v1',
  '高德地图': 'com.autonavi.minimap',
  '百度地图': 'com.baidu.BaiduMap',
  '小红书': 'com.xingin.xhs',
  '知乎': 'com.zhihu.android',
  '豆瓣': 'com.douban.frodo',
  'System Home': 'com.android.launcher3',
}

/**
 * List all supported apps.
 */
export function listSupportedApps(): string[] {
  return Object.keys(APP_PACKAGES).filter(app => app !== 'System Home')
}
