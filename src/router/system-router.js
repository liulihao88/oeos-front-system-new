const Layout = () => import('@/layout/index.vue')
import DarkSvg from '@/assets/svg/dark.svg'
import DaySvg from '@/assets/svg/day.svg'
import tenantViewSvg from '@/assets/svg/menu/tenant-view.svg'
import spaceManagementSvg from '@/assets/svg/menu/space-management.svg'
import BucketListSvg from '@/assets/svg/menu/bucket-list.svg'
import easySearchSvg from '@/assets/svg/menu/easy-search.svg'
import advanceSearchSvg from '@/assets/svg/menu/advance-search.svg'
import unfreezeViewSvg from '@/assets/svg/menu/unfreeze-view.svg'
import taskManagementSvg from '@/assets/svg/menu/task-management.svg'
import bucketTaskSvg from '@/assets/svg/menu/bucket-task.svg'
import taskPlanSvg from '@/assets/svg/menu/task-plan.svg'
import securityPermissionSvg from '@/assets/svg/menu/security-permission.svg'
import userManagemenetSvg from '@/assets/svg/menu/user-management.svg'
import groupManagementSvg from '@/assets/svg/menu/group-management.svg'
import bucketViewSvg from '@/assets/svg/menu/bucket-view.svg'
import spaceViewSvg from '@/assets/svg/menu/space-view.svg'
import serviceManageMentSvg from '@/assets/svg/menu/service-management.svg'
import innerCommandSvg from '@/assets/svg/menu/inner-command.svg'
import tenentControlSvg from '@/assets/svg/menu/tenent-control.svg'
import tenantEventSvg from '@/assets/svg/menu/tenant-event.svg'
import systemSettingSvg from '@/assets/svg/menu/system-setting.svg'
import defaultConfigSvg from '@/assets/svg/menu/default-config.svg'
import testSvg from '@/assets/svg/menu/test.svg'

import XtglSvg from '@/assets/svg/system/xtgl.svg'
import JcjgSvg from '@/assets/svg/system/jcjg.svg'
import CcglSvg from '@/assets/svg/system/ccgl.svg'
// import XtzhSvg from '@/assets/svg/system/xtzh.svg'
import FwgnSvg from '@/assets/svg/system/fwgn.svg'
import XtjkSvg from '@/assets/svg/system/xtjk.svg'
import XtpzSvg from '@/assets/svg/system/xtpz.svg'
import XtwhSvg from '@/assets/svg/system/xtwh.svg'
import JdlbSvg from '@/assets/svg/system/jdlb.svg'
import FwlbSvg from '@/assets/svg/system/fwlb.svg'
import LglbSvg from '@/assets/svg/system/qscclb.svg'
import RwpzSvg from '@/assets/svg/system/rwpz.svg'
import GjpzSvg from '@/assets/svg/system/gjpz.svg'
import SjszSvg from '@/assets/svg/system/sjsz.svg'
import HbpzSvg from '@/assets/svg/system/hbpz.svg'

const isDev = process.env.NODE_ENV === 'development'
export default [
  {
    id: 'SM000',
    path: '/apps/overview',
    component: Layout,
    meta: {
      icon: XtglSvg,
      title: '系统概览',
    },
    children: [
      {
        path: '/apps/overview',
        name: 'Overview',
        component: 'overview/index',
        meta: {
          icon: XtglSvg,
          title: '系统概览',
        },
      },
    ],
  },
  {
    id: 'SM010',
    path: '/framework',
    component: Layout,
    meta: {
      icon: JcjgSvg,
      title: '基础架构',
    },
    children: [
      {
        id: 'SM011',
        path: '/framework/node',
        name: 'FrameworkNode',
        component: 'framework/node',
        meta: {
          icon: JdlbSvg,
          title: '节点列表',
        },
      },
      {
        id: 'SM012',
        path: '/framework/service',
        name: 'FrameworkService',
        component: 'framework/service',
        meta: {
          icon: FwlbSvg,
          title: '服务列表',
        },
      },
      {
        id: 'SM013',
        path: '/framework/ocean',
        name: 'FrameworkOcean',
        component: 'framework/ocean',
        meta: {
          icon: LglbSvg,
          title: '蓝光列表',
        },
      },
    ],
  },
  {
    id: 'SM020',
    path: '/storage',
    component: Layout,
    meta: {
      icon: CcglSvg,
      title: '存储管理',
    },
    children: [
      {
        id: 'SM021',
        path: '/storage/overview',
        name: 'StorageOverview',
        component: 'storage/overview',
        meta: {
          icon: BucketListSvg,
          title: '存储概览',
        },
      },
      {
        id: 'SM022',
        path: '/storage/cache',
        name: 'StorageCache',
        component: 'storage/cache',
        meta: {
          icon: BucketListSvg,
          title: '缓存概览',
        },
      },
      {
        id: 'SM023',
        path: '/storage/class',
        name: 'StorageClass',
        component: 'storage/class',
        meta: {
          icon: BucketListSvg,
          title: '存储层',
        },
      },
      {
        id: 'SM024',
        path: '/storage/pool',
        name: 'StoragePool',
        component: 'storage/pool',
        meta: {
          icon: BucketListSvg,
          title: '池配置',
        },
      },
      {
        id: 'SM025',
        path: '/storage/component',
        name: 'StorageComponent',
        component: 'storage/component',
        meta: {
          icon: BucketListSvg,
          title: '组件配置',
        },
      },
    ],
  },

  {
    id: 'SM030',
    path: '/tenant',
    component: Layout,
    meta: {
      // icon: XtzhSvg,
      title: '系统租户',
    },
    children: [
      {
        id: 'SM031',
        path: '/tenant/management',
        name: 'TenantManagement',
        component: 'tenant/management',
        meta: {
          icon: BucketListSvg,
          title: '租户管理',
          showParent: true,
        },
      },
    ],
  },

  {
    id: 'SM040',
    path: '/feature',
    component: Layout,
    meta: {
      icon: FwgnSvg,
      title: '服务功能',
    },
    children: [
      {
        id: 'SM041',
        path: '/feature/command',
        name: 'FeatureCommand',
        component: 'feature/command',
        meta: {
          icon: BucketListSvg,
          title: '内置命令',
          showParent: true,
        },
      },
    ],
  },

  {
    id: 'SM050',
    path: '/monitor',
    component: Layout,
    meta: {
      icon: XtjkSvg,
      title: '系统监控',
    },
    children: [
      {
        id: 'SM051',
        path: '/monitor/systemlog',
        name: 'MonitorSystemlog',
        component: 'monitor/systemlog',
        meta: {
          icon: BucketListSvg,
          title: '服务日志',
        },
      },
      {
        id: 'SM052',
        path: '/monitor/event',
        name: 'MonitorEvent',
        component: 'monitor/event',
        meta: {
          icon: BucketListSvg,
          title: '系统事件',
        },
      },
      {
        id: 'SM053',
        path: '/monitor/audit',
        name: 'MonitorAudit',
        component: 'monitor/audit',
        meta: {
          icon: BucketListSvg,
          title: '审计日志',
        },
      },
    ],
  },

  {
    id: 'SM060',
    path: '/config',
    component: Layout,
    meta: {
      icon: XtpzSvg,
      title: '系统配置',
    },
    children: [
      {
        id: 'SM061',
        path: '/config/schedule',
        name: 'ConfigSchedule',
        component: 'config/schedule',
        meta: {
          icon: RwpzSvg,
          title: '任务配置',
        },
      },
      {
        id: 'SM062',
        path: '/config/notification',
        name: 'ConfigNotification',
        component: 'config/notification',
        meta: {
          icon: GjpzSvg,
          title: '告警配置',
        },
      },
      {
        id: 'SM063',
        path: '/config/audit',
        name: 'ConfigAudit',
        component: 'config/audit',
        meta: {
          icon: SjszSvg,
          title: '审计设置',
        },
      },
      {
        id: 'SM064',
        path: '/config/sync',
        name: 'ConfigSync',
        component: 'config/sync',
        meta: {
          icon: BucketListSvg,
          title: '复制关系',
          showLink: false,
        },
      },
      {
        id: 'SM065',
        path: '/config/logo',
        name: 'ConfigLogo',
        component: 'config/logo',
        meta: {
          icon: HbpzSvg,
          title: '徽标配置',
        },
      },
    ],
  },

  {
    id: 'SM070',
    path: '/maintenance',
    component: Layout,
    meta: {
      icon: XtwhSvg,
      title: '系统维护',
    },
    children: [
      {
        id: 'SM071',
        path: '/maintenance/license',
        name: 'MaintenanceLicense',
        component: 'maintenance/license',
        meta: {
          icon: BucketListSvg,
          title: '容量许可证',
        },
      },
      {
        id: 'SM072',
        path: '/maintenance/upgrade',
        name: 'MaintenanceUpgrade',
        component: 'maintenance/upgrade',
        meta: {
          icon: BucketListSvg,
          title: '系统升级',
        },
      },
    ],
  },

  {
    path: '/test',
    component: Layout,
    meta: {
      icon: testSvg,
      showLink: isDev,
      title: '测试页',
      rank: 0,
    },
    children: [
      {
        path: '/test/t1',
        name: 'T1',
        component: 'test/t1',
        meta: {
          title: '测试页1',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/test2',
    component: Layout,
    meta: {
      showLink: isDev,
      icon: testSvg,
      title: '测试页2顶部',
      rank: 0,
    },
    children: [
      {
        path: '/test/t2',
        name: 'T2',
        component: 'test/t2',
        meta: {
          title: '测试页2',
          showLink: true,
        },
      },
      {
        path: '/test/t22',
        name: 'T22',
        component: 'test/t22',
        meta: {
          title: '测试页22',
          showLink: false,
        },
      },
    ],
  },
  {
    path: '/test3',
    component: Layout,
    meta: {
      showLink: isDev,
      icon: testSvg,
      title: '测试页2顶部',
      rank: 0,
    },
    children: [
      {
        path: '/test/t3',
        name: 'T3',
        component: 'test/t3',
        meta: {
          title: '测试页3',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/test4',
    component: Layout,
    meta: {
      showLink: isDev,
      icon: testSvg,
      title: '测试页2顶部',
      rank: 0,
    },
    children: [
      {
        path: '/test/t4',
        name: 'T4',
        component: 'test/t4',
        meta: {
          title: '测试页4',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/test5',
    component: Layout,
    meta: {
      showLink: isDev,
      icon: testSvg,
      title: '测试页2顶部',
      rank: 0,
    },
    children: [
      {
        path: '/test/t5',
        name: 'T5',
        component: 'test/t5',
        meta: {
          title: '测试页5',
          showLink: true,
        },
      },
    ],
  },
  {
    path: '/test6',
    component: Layout,
    meta: {
      showLink: isDev,
      icon: testSvg,
      title: '测试页2顶部',
      rank: 0,
    },
    children: [
      {
        path: '/test/t6',
        name: 'T6',
        component: 'test/t6',
        meta: {
          title: '测试页6',
          showLink: true,
        },
      },
    ],
  },
]
