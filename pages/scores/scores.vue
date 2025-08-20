<template>
  <view :style="[getTheme(),SXData]">
    <material-nav-bar>
      <view class="nav-bar">
        <uni-icons type="left" size="" @click="back" class="icon-left"/>
        <text class="title">成绩查询</text>
        <uni-icons type="loop" size="" @click="update(true)" class="icon-right"/>
      </view>
    </material-nav-bar>
    <scroll-view scroll-y="true" class="scroll-table">
      <slot v-for="(item, index) in tableData">
        <view class="content">
          <material-card width="100%" color="var(--md-sys-color-on-primary)"
                         :backgroundColor="item.jd === `0.00` ? 'var(--md-sys-color-tertiary-container)':'var(--md-sys-color-primary-container)'"
                         @click="getDetail(item.jxb_id,item.xnm,item.xqm,item.kcmc)">
            <view class="card-content"
                  :style="{color: item.jd === `0.00`?'var(--md-sys-color-on-tertiary-container)':'var(--md-sys-color-on-primary-container)'}">
              <view class="time">
                {{ item.xnmmc }}
                <uni-icons v-if="item.jd !== `0.00`" type="checkbox-filled" :size="mx(8)"
                           color="var(--md-sys-color-on-primary-container)" @click="update" class="icon-right"/>
                <uni-icons v-if="item.jd === `0.00`" type="clear" :size="mx(8)"
                           color="var(--md-sys-color-on-tertiary-container)" @click="update" class="icon-right"/>
              </view>
              <view class="name">
                {{ item.kcmc }}
              </view>
              <view class="score">
                成绩：{{ item.cj }}{{ " " }}学分：{{ item.xf }}
              </view>

              <view class="teacher">
                {{ item.jsxm }}
              </view>
            </view>
          </material-card>
        </view>

      </slot>

    </scroll-view>
    <uni-popup ref="detail">
      <view class="detail-modal" :mask-click="false">
        <view class="name">{{ className }}</view>
        <uni-table border stripe emptyText="暂无更多数据">
          <uni-tr>
            <uni-th width="1" align="center">成绩分项</uni-th>
            <uni-th width="1" align="center">成绩分项比例</uni-th>
            <uni-th width="1" align="center">成绩</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in detail" :key="index">
            <uni-td align="center">{{ item.scoreItem }}</uni-td>
            <uni-td align="center">{{ item.percentage }}</uni-td>
            <uni-td align="center">{{ item.score }}</uni-td>
          </uni-tr>
        </uni-table>
        <button class="ok" type="primary" @click="cancel">确认</button>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import UniIcons from "@/uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import UniEasyinput from "@/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue";
import UniPopup from "@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import UniNavBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import UniTable from "@/uni_modules/uni-table/components/uni-table/uni-table.vue";
import UniTr from "@/uni_modules/uni-table/components/uni-tr/uni-tr.vue";
import UniTd from "@/uni_modules/uni-table/components/uni-td/uni-td.vue";
import UniTh from "@/uni_modules/uni-table/components/uni-th/uni-th.vue";
import MaterialCard from "@/components/material-uni/material-card/material-card.vue";
import MaterialNavBar from "@/components/material-uni/material-nav-bar/material-nav-bar.vue";
import {mx, SXData} from "@/components/material-uni/sx";
import {getTheme} from "@/components/material-uni/colors";

export default {
  computed: {
    SXData() {
      return SXData
    }
  },
  components: {
    MaterialNavBar,
    MaterialCard, UniTh, UniTd, UniTr, UniTable, UniNavBar, UniPopup, UniEasyinput, UniIcons
  },
  data() {
    return {
      className: 'test',
      detail: [],
      loginPage: null,
      check: null,
      wait: null,
      captchaImg: null,
      username: '',
      password: '',
      captcha: '',
      loading: false,
      heigth: 0,
      tableData: []
    }
  },
  onReady() {
    // #ifdef H5
    this.tableData = [
      {
        "cj": "65",
        "jd": "2.00",
        "xf": "3.0",
        "jsxm": "姚军财",
        "jxb_id": "1B62664DD61FAA19E06365CBA8C04E61",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "操作系统A",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "徐梦溪",
        "jxb_id": "19920255E4C89095E06365CBA8C09EE9",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "多媒体技术项目训练",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "卢阿丽",
        "jxb_id": "19927017C99CB3C2E06365CBA8C05493",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "数字图像处理技术项目实训",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "79",
        "jd": "3.00",
        "xf": "3.0",
        "jsxm": "卢阿丽",
        "jxb_id": "19927017CA62B3C2E06365CBA8C05493",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "数字图像处理技术",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "61",
        "jd": "1.00",
        "xf": "3.0",
        "jsxm": "徐梦溪",
        "jxb_id": "1991DA80CE0985D2E06365CBA8C076D1",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "多媒体技术 ",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "71",
        "jd": "2.50",
        "xf": "3.5",
        "jsxm": "王兴",
        "jxb_id": "19A8030A8F712356E06365CBA8C0549A",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "计算机组成与结构",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "通过",
        "jd": "3.50",
        "xf": "0.5",
        "jsxm": "王振宇",
        "jxb_id": "1B6303F04A981CD5E06365CBA8C0D7DE",
        "xnm": "2024",
        "xqm": "3",
        "kcmc": "体质测试Ⅰ",
        "xnmmc": "2024-2025",
        "xqmmc": "1"
      },
      {
        "cj": "99",
        "jd": "5.00",
        "xf": "2.0",
        "jsxm": "超星在线",
        "jxb_id": "0AB85D6123E34A35E06365CBA8C068A0",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "KX 中国历史人文地理（上）(ZA02)",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "94",
        "jd": "4.50",
        "xf": "0.5",
        "jsxm": "王玉",
        "jxb_id": "0B86C3985A381708E06365CBA8C0256C",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "武术(拳)-Ⅳ",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "76",
        "jd": "3.00",
        "xf": "4.0",
        "jsxm": "温志萍",
        "jxb_id": "0D3B90E009315037E06365CBA8C0BD0D",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "数据库原理及应用A",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "83",
        "jd": "3.50",
        "xf": "3.5",
        "jsxm": "王健",
        "jxb_id": "0D3A82263440B009E06365CBA8C027E9",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "计算机网络A",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "丁宇辰",
        "jxb_id": "0BFB48EF14A68197E06365CBA8C0940F",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "计算机图形学课程设计",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "温志萍",
        "jxb_id": "0D39E9667A227D61E06365CBA8C0682A",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "数据库原理及应用课设",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "65",
        "jd": "2.00",
        "xf": "3.0",
        "jsxm": "丁宇辰",
        "jxb_id": "0BFAD71C35B860FDE06365CBA8C0949A",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "计算机图形学",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "78",
        "jd": "2.50",
        "xf": "3.0",
        "jsxm": "无",
        "jxb_id": "123EF95158FC947CE06365CBA8C06570",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "大学物理AⅡ",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "63",
        "jd": "1.00",
        "xf": "3.0",
        "jsxm": "张同丽",
        "jxb_id": "0D3B7462E07D4288E06365CBA8C0D133",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "概率论与数理统计A",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "76",
        "jd": "3.00",
        "xf": "2.0",
        "jsxm": "朱姝颖",
        "jxb_id": "0AB47129F74E8725E06365CBA8C079E4",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "工程学科英语",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "83",
        "jd": "3.50",
        "xf": "0.5",
        "jsxm": "夏细明",
        "jxb_id": "1411FE\u0000\u0000\u0000\b\u0000E092CA5479E06365CBA8C00923",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "最美校园-蔬菜种养劳动教育实践项目",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "86",
        "jd": "4.00",
        "xf": "3.0",
        "jsxm": "高登晖",
        "jxb_id": "0D609BE364DB3C2FE06365CBA8C03ADC",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "习近平新时代中国特色社会主义思想概论",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "88",
        "jd": "4.00",
        "xf": "3.0",
        "jsxm": "高登晖",
        "jxb_id": "0D518474FE4FBBD2E06365CBA8C0303D",
        "xnm": "2023",
        "xqm": "12",
        "kcmc": "毛泽东思想和中国特色社会主义理论体系概论",
        "xnmmc": "2023-2024",
        "xqmmc": "2"
      },
      {
        "cj": "80",
        "jd": "3.50",
        "xf": "4.0",
        "jsxm": "联盟河海",
        "jxb_id": "03E2C49AE9B986FAE06365CBA8C0F4F3",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "GX 信号与系统",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "100",
        "jd": "5.00",
        "xf": "2.0",
        "jsxm": "顾燕华",
        "jxb_id": "FAED7F2483D779CFE05365CBA8C01A7F",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "KX 现代自然地理学(ZD52)",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "94",
        "jd": "4.50",
        "xf": "0.5",
        "jsxm": "王玉",
        "jxb_id": "FA992F91DBAAB6A5E05365CBA8C05DAC",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "武术(拳)-Ⅲ",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "优秀",
        "jd": "4.50",
        "xf": "1.0",
        "jsxm": "潘磊",
        "jxb_id": "FD704EC81DD225A5E05365CBA8C03BD5",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "数据结构与算法课程设计",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "优秀",
        "jd": "4.50",
        "xf": "2.0",
        "jsxm": "岳红原",
        "jxb_id": "FC56C4E4F322BFA9E05365CBA8C08481",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "建模与动画技术项目实训",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "90",
        "jd": "4.50",
        "xf": "3.0",
        "jsxm": "庄严",
        "jxb_id": "FC56C47669E2BFA5E05365CBA8C04F1F",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "数字媒体开发基础",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "3.0",
        "jsxm": "岳红原",
        "jxb_id": "FC56631EA9F09DB4E05365CBA8C05BCB",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "JAVA实用开发技术",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "78",
        "jd": "3.00",
        "xf": "3.0",
        "jsxm": "韩磊",
        "jxb_id": "FD474CBDC15B07CAE05365CBA8C0AC1D",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "离散数学",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "66",
        "jd": "2.00",
        "xf": "4.5",
        "jsxm": "潘磊",
        "jxb_id": "FD6E667BBD444CF9E05365CBA8C05317",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "数据结构与算法",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "86",
        "jd": "4.00",
        "xf": "1.0",
        "jsxm": "许生慧",
        "jxb_id": "FC34924D5091B509E05365CBA8C084A7",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "大学物理实验AⅡ",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "56",
        "jd": "0.00",
        "xf": "3.0",
        "jsxm": "刘津升",
        "jxb_id": "FC2F5C9EAAAE9E90E05365CBA8C0C125",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "大学物理AⅡ",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "64",
        "jd": "1.00",
        "xf": "2.0",
        "jsxm": "王广胜",
        "jxb_id": "FC6B769EB12E560AE05365CBA8C042CE",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "线性代数A",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "68",
        "jd": "2.00",
        "xf": "1.0",
        "jsxm": "季芸",
        "jxb_id": "FC5744104E5027C4E05365CBA8C0C971",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "工程英语视听说",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "67",
        "jd": "2.00",
        "xf": "2.0",
        "jsxm": "鲁海燕",
        "jxb_id": "FC44AF2A0CC76C9DE05365CBA8C0EE29",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "笔译入门",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "86",
        "jd": "4.00",
        "xf": "1.5",
        "jsxm": "倪佳佳",
        "jxb_id": "FDEB0E031ED0033AE05365CBA8C00C75",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "大学生创新创业教育",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "73",
        "jd": "2.50",
        "xf": "3.0",
        "jsxm": "虞斌龙",
        "jxb_id": "FD592A45DB6F6223E05365CBA8C08250",
        "xnm": "2023",
        "xqm": "3",
        "kcmc": "马克思主义基本原理",
        "xnmmc": "2023-2024",
        "xqmmc": "1"
      },
      {
        "cj": "91",
        "jd": "4.50",
        "xf": "0.5",
        "jsxm": "王玉",
        "jxb_id": "ED56DDB1DE98BD9FE05365CBA8C0571F",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "武术（拳）-Ⅱ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "88",
        "jd": "4.00",
        "xf": "1.0",
        "jsxm": "吴晓彬",
        "jxb_id": "ECDA24D0DA1B214BE05365CBA8C0B040",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "企业认识实习",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "优秀",
        "jd": "4.50",
        "xf": "2.0",
        "jsxm": "岳红原",
        "jxb_id": "ECD8E2649B8F9979E05365CBA8C05062",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "建模与动画基础",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "c\u0000\u0000\u0000\u0000j": "82",
        "jd": "3.50",
        "xf": "2.0",
        "jsxm": "徐梦溪",
        "jxb_id": "ECD8E2649B819979E05365CBA8C05062",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "UI设计",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "优秀",
        "jd": "4.50",
        "xf": "2.0",
        "jsxm": "杨庆",
        "jxb_id": "ECDA3321A56B2FBAE05365CBA8C00EC9",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "C/C++程序设计课程设计",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "88",
        "jd": "4.00",
        "xf": "3.0",
        "jsxm": "吴晓彬;张冰",
        "jxb_id": "ECD8AF4474467E4FE05365CBA8C005B0",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "C/C++程序设计Ⅱ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "84",
        "jd": "3.50",
        "xf": "1.5",
        "jsxm": "李丛杨",
        "jxb_id": "EED468939A445E47E05365CBA8C0F3D1",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "大学生心理健康教育",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "86",
        "jd": "4.00",
        "xf": "1.0",
        "jsxm": "周爱平",
        "jxb_id": "EDF2DAE834CB6229E05365CBA8C0B3F9",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "大学物理实验AⅠ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "78",
        "jd": "3.00",
        "xf": "3.0",
        "jsxm": "刘津升",
        "jxb_id": "ED6AD4D439F77771E05365CBA8C0FD8D",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "大学物理AⅠ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "66",
        "jd": "2.00",
        "xf": "4.0",
        "jsxm": "滑伟",
        "jxb_id": "EE1EBAC889D25F07E05365CBA8C0CFC5",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "高等数学BⅡ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "76",
        "jd": "3.00",
        "xf": "2.0",
        "jsxm": "郑文宝",
        "jxb_id": "ED2E57C4890B3867E05365CBA8C013E6",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "中国近现代史纲要",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "72",
        "jd": "2.50",
        "xf": "1.0",
        "jsxm": "季芸",
        "jxb_id": "ED284F8D2B477A52E05365CBA8C0A8D1",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "中级英语视听说AⅡ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "64",
        "jd": "1.00",
        "xf": "2.0",
        "jsxm": "董晓燕",
        "jxb_id": "ED2CF20231587E40E05365CBA8C04B1F",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "中级英语Ⅱ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "庄严;丁宇辰",
        "jxb_id": "ECDCB1F017AD4F64E05365CBA8C0B89B",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "多媒体系统认知与实践（劳动）",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "88",
        "jd": "4.00",
        "xf": "1.0",
        "jsxm": "李丛杨",
        "jxb_id": "EEBEFCC567CC3244E05365CBA8C00C0F",
        "xnm": "2022",
        "xqm": "12",
        "kcmc": "大学生职业发展与就业指导Ⅰ",
        "xnmmc": "2022-2023",
        "xqmmc": "2"
      },
      {
        "cj": "81",
        "jd": "3.50",
        "xf": "0.5",
        "jsxm": "王玉",
        "jxb_id": "E6173608B7B5111FE05365CBA8C015D1",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "武术（拳）-Ⅰ",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "82",
        "jd": "3.50",
        "xf": "3.0",
        "jsxm": "丁宇辰",
        "jxb_id": "E2B56FB6884C650AE05365CBA8C05F2A",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "计算机科学概论",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "85",
        "jd": "4.00",
        "xf": "4.0",
        "jsxm": "杨庆",
        "jxb_id": "E2BA69A249FC6400E05365CBA8C0ED50",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "C/C++程序设计Ⅰ",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "66",
        "jd": "2.00",
        "xf": "4.0",
        "jsxm": "王广胜",
        "jxb_id": "E2FB4242A65B01DCE05365CBA8C0483A",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "高等数学BⅠ",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "77",
        "jd": "3.00",
        "xf": "3.0",
        "jsxm": "郑赟",
        "jxb_id": "DFCF18A9C5C06556E05365CBA8C09B82",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "大学英语综合I",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "91",
        "jd": "4.50",
        "xf": "0.5",
        "jsxm": "李海燕;马群",
        "jxb_id": "E6A913E36CAC5A82E05365CBA8C0B846",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "体育与健康",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "良好",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "李丛杨",
        "jxb_id": "E2B700AB730223A5E05365CBA8C001F7",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "军训",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "84",
        "jd": "3.50",
        "xf": "1.0",
        "jsxm": "孙大尉",
        "jxb_id": "E2C9ABB770670DCBE05365CBA8C0732D",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "军事理论",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "93",
        "jd": "4.50",
        "xf": "0.5",
        "jsxm": "王晓红",
        "jxb_id": "E2F6F9506DDA2039E05365CBA8C05DFB",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "劳动教育导论",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      },
      {
        "cj": "88",
        "jd": "4.00",
        "xf": "2.0",
        "jsxm": "徐丽丽",
        "jxb_id": "E30DC85540DA9F6EE05365CBA8C0B5B5",
        "xnm": "2022",
        "xqm": "3",
        "kcmc": "思想道德修养与法律基础",
        "xnmmc": "2022-2023",
        "xqmmc": "1"
      }
    ]
    // #endif

    // setTimeout(() => {
      this.update(false)
    // }, 500)
  },
  methods: {
    mx,
    getTheme,
    cancel() {
      this.$refs.detail.close();
    },
    back() {
      uni.navigateBack();
    },
    update(refresh) {
      uni.showToast({
        title: '尝试刷新',
        icon: 'loading',
        duration: 1000
      });

      this.$manager.getAllSorces(refresh).then(res => {
        console.log(res)
        this.tableData = JSON.parse(res).data;
        this.tableData = this.tableData.reverse()
        console.log(this.tableData)
      }).catch(err => {
        console.error(err)
        // uni.hideLoading();
        uni.showToast({
          title: '获取成绩失败',
          icon: 'error',
          duration: 2000
        });
      })
    },
    // calculateAverageGPA(tableData) {
    //   let totalCredit = 0; // 总学分
    //   let totalCreditPoint = 0; // 总学分绩点
    //   console.log(tableData.length)
    //   tableData.forEach(item => {
    //     totalCredit += parseFloat(item.xf); // 累加课程学分
    //     totalCreditPoint += parseFloat(item.xf) * parseFloat(item.jd); // 累加学分绩点
    //   });
    //   console.log(totalCredit, totalCreditPoint)
    //   let averageGPA = totalCreditPoint / totalCredit; // 计算平均学分绩点
    //   return parseFloat(averageGPA.toFixed(2)); // 四舍五入保留两位小数
    // },

    getDetail(id, xnm, xqm, kcmc) {
      uni.showLoading({
        title: '加载详细信息'
      });
      this.className = kcmc;
      this.$manager.getSorcesDetail(id, xnm, xqm, kcmc).then(res => {
        console.log(res)
        let detail = JSON.parse(res)
        this.detail = detail.data

        uni.hideLoading();
        this.$refs.detail.open('center');
      }).catch(err => {
        console.error(err)
        uni.hideLoading();
        uni.showToast({
          title: '获取成绩失败',
          icon: 'error',
          duration: 2000
        });
      })
    }
  }
}
</script>

<style lang="scss">
.header {
  height: 100%;
  width: 100%;
  background: #fff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  //justify-content: center;


  .icon-left {
    margin-left: 50rpx;

    /* 调整这个值控制间距 */
    position: relative;
    //top: -6rpx
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }

  .icon-right {
    margin-right: 50rpx;
    /* 调整这个值控制间距 */
    position: relative;
    will-change: transform;
    //top: -6rpx
  }


  .title {
    margin: 0 auto;
    display: block;
    text-align: center;
    font-size: 36rpx;
    color: #333;
  }
}

.select {
  .group {
    margin-top: 40rpx;
    display: flex;

    .select-scroll {
      white-space: nowrap;
      width: 100%;
    }

    .select-item {
      display: inline-block;
      width: 150rpx;
      text-align: center;
      border-right: #3a3a3a solid 1px;

      &:first-child {
        border-left: #3a3a3a solid 1px;
      }

      .text {
        width: 100%;
        text-align: center;
        font-size: 40rpx;
        color: #959595;
      }
    }

    .active {
      background-color: #cdcfd5;

      .text {
        color: #5489f5;
      }
    }
  }
}

$modal-width: 90vw;
.login-modal {
  width: $modal-width;
  height: $modal-width * 0.75;
  border-radius: 40rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .wrap {
    display: flex;
    flex-direction: column;
    width: 90%;

    .input {
      margin-top: 20rpx;
    }
  }

  .captcha {
    display: flex;

    .captcha-img {
      margin-top: 20rpx;
      height: 70rpx;
      width: 200rpx;
    }
  }

  .btn-wrap {
    width: 100%;
    display: flex;

    .login-btn {
      margin-top: 20rpx;
      width: 45%;
      //height: 80rpx;
    }
  }
}

.scroll-table {
  height: calc(100vh - sx(10) - var(--status-bar-height));

  .color-red {
    color: red;
  }
}

.btn-evaluate {
  //width: 30rpx;
  //height: 60rpx;
  font-size: 30rpx;
}

.detail-modal {
  border-radius: 20rpx;
  border: 1px #fff solid;
  background-color: #fff;
  width: 90vw;

  .name {
    height: 50rpx;
    width: 100%;
    font-size: 35rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ok {
    margin: 0 auto;
    width: 90%;
  }
}

.content {
  padding-left: sx(2.5);
  padding-right: sx(2.5);
  margin-top: sx(2.5);

  .card-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: sx(2.5);

    .time {
      display: flex;
      justify-content: space-between;
      font-size: sx(6.5);
      font-weight: bold;
    }

    .name {
      font-size: sx(6.5);
      font-weight: bold;
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .score {
      font-weight: bold;
    }

    .teacher {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>