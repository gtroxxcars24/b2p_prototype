export interface Cars24Short {
  id: string;
  index: number;
  title: string;
  url: string;
  thumbnail: string;
}

const CARS24_SHORT_IDS = `
UImqM5duD38 uWlUFBUqpBM W1vVWulIghY ANR8APwEbhM NDWGdhHOuAY rfvDhGQziDk O35szDnG_-k EaueTxU51K0 IIwuoek6ghg jNVGkEs0yHI 4S0JdQvB40M AgMrxDBx4Os 1rtQ7rYIWY0 7UGMmzQ3yV8 qDXuPTGve-8 Tbp_h08ZUdk N877IDASYxo 5gALLIJoaHs ekOthwL7stI yhIQysLbQvA SC8h5Fox-2o 47u87auNc0Q B56Q3hN5aoI vKrdGi8aCBE rpK0BDXDzqU ytV9WBq110Y SIM7bVNkQe8 fDKU4BDFeaY wdXp0kjh9J8 qNp2ASMvZt8 cCef9v9KiFs iSYDPS9SdlA w2nm-q5TGgw tj2HrOfR4jY NwvrCLnEsYw tscNGsG5yko 3HFn-yfH7Sg TvTAIZz6t-E WcRBXubFF1w DMI8h9HyWoI MaysFbAZyTM sjNPYQOUx0g 8-wscXYNyqw AgD3NQSQvYs 0fzWFu1Vz5g -K46_sNW7H0 hvIHReI9tbE 8nSkRMGT17Y M35LQeCV0Tw 82D44VwHba4 Y_uOe0aeoyI JMgH7mGp68A GzpmwtKkinw dYjjLxChV_I CK2q4EXPUTw AHnMnfGIjW8 ENfmE54au0w 8WJjKvt7JYQ oo3TQioOljQ 0_qKfycpUow 1IRXEAGvx74 wKysCVHc1pE 3UpjUVCZWgk Qbg_2aDwcoQ 1egLuOAqQYI POfu_FSm_OE A7IKOpOQXHk 1hSdY5LKl4s 52R2hqB3hho -g5TuYSQMr8 CVxrhCbcyY4 F7xLB2t07II IT6ZGOKZWOE ZRpZIPwO_1Y PDbol6UldpY Q5eETsHfWek ez16QoKn19A R8rAqeF2tg0 N9INow3_-C8 _TyTEeK5RtI
pWUbXscZc4w B0kxYtzxu5U XxupBv46aPw CaP_xPZN4dw XMoyafax7Bg PZHEZzSeHDs 2xQ2diZaJps 61xgp1hBJIM 7HEYdV8jO4Y -4YDTO_XSi0 WtXJcp-4tWE kw6HuOlEa_k S-VTI6N6sjo 560ckbI2PCg Kchx2iUXlbE LYg59y22-sI qRLxdHiAIBc gyX8jHyNp4M uIBeg2DnMJM eQfmoC4w1TI mcw-0KwHEu0 w_tDkyDHD5s lVoxyc3x1xM CdJvNEKWUc8 mP-wWX9Y6Yc tLXLaDso1oc Fwiow74FxNw zwWoCdXz6s4 N4RaOxwi_Uk ZBrFR7yNcxw ENoBLaaxy9Q bSo9HopLozM xMRnP3Pmmkc 2Rhe0fKO40E NEHhwpM_1oU Y47ffBMaE8o jbZEQzDwV_g d4CqQWaj-KE rv9LRoK3Oow ycnKvPr0MHk rPhoiIJdcS8 cIiDeTuxZTk W99_4rrMc7M tndNTMg8PI0 vlQtICMvZ-k Oe5koNT2HTs fcvgkIA2Skk JfwuHKCmPRY zEWLfzihhOs 3hs4Dc-Z864 flUOukGsDBg qgeeueSuSWQ blSb92aHe30 YRCvTCU12vM adw3QzJwe40 kfZJBV_ttC0 hf03Q4Z8K1Q 4XAUJMdozaE x6zRnfKeosI gfRR6uQpvsQ pHhHalaO-cY 9PQMhiZGums fI8zye4xGJA OJRCXGEUGy0 Bo0i0wOMEQ4 UskNJfEooFI -_8k2MQbwuk apW88ruaWL0 hGPa4goWlKA WRPRN4j0i1U 4sEKAdoTyUM pur-2kZRUhc 9UYzWcMS-S0 PrkW7-OIne0 0RrQKqRzTZA 61rQRGrbTD8 NC0S4HU0eu0 yzUFr0epdz4 aRb2qwsO8_c dTG4TqJVLqo
ZkAGw04nGbY YvpYghig_Ns bmr10KWTQDA K_JQRde3j9c F0uNkhZSuYk 0G83vFWbNQY 53zdjVp4w9E xvo9WPYmQpI MN9SqZRi7Cc FhdWTmZzbRg u3pZP4FlCJA isv9O8m9pns mHWB0ep87sI -msR8X2_P-s xMDoE9Tqv6s 9MUlAsSDxb0 f-YrbQUFZlE tFG5I9NF53g xpfiVLH5xL4 -s_iG8qaF8k ptblbjVPadQ MPLIJDv4s1o 6i4F0cp4YXg jLHm69ovSR4 IxJDEVClb90 3Ut7kqEmrrY OE8cZBsfWto EML8G0u26kM q_YZM_RZKNI 6bv1SOc7Uw8 Pc9Vobaosbc ZbSexxbRnfo Lsb8AFgLink Hww23UBy-TY _wmwHSd1_E0 LlrNIsg9nAQ aEFqsyPIdNQ OH_wqPFJCxQ DnsuzijOvnE r1h7MDdwuS0 wIiuB2BeLMU pLZ3FSmFmBI sWfZeMUB9rs h1QbhMuF3R8 6X1CdIl4wyU 6VfmRGZqBCQ NBM4uFxJlOc 9zDTLW4Iazw P1zmsPJIa7U YP3HW8Wa0lQ 6D8fjHu87oY G6P6nG7qbPk O3eG5jB2qU4 4DX-IfWJ41c Y54_yQGCvwc dQwTGtcuqFo QFLd7jq76Mo ZPz01OXxKTI qFJHjOo_dAQ U5VBuDutTis BXuRpvr-0_s 3yW2rCySCUM VKp3CTom4xo 4PDsUQiGESI 6Lis6Tt8oKY OLA3p7na1Jk TDbVm0CAcN8 FXYBAyo_lYY kAP014YgwrQ NyB6MT2WKFE ge14PKCFr8k U_Rw4g7yfQs Elc0m9b7x9w 8TpjGVsjXpE MC24l9_LTPM 1mVhmy4xja4 fvVd8BUsBUg JRoHLRhV5bg DOQhkl_uCBc L2X5VVuPsl4
KIIfqivh6yA kvUNNvupyuE TUINgjzF0II HnHwCbPSQ1E V5uOlb6DDgg GsN3N65IUSY 4oWOy8LTAEY NOkwNNa9wmw NQFxWgQaZ2o tv2OyCS2tmc N9QM-ToDAx8 yLJjvZFQkQM z0UbqUlTVhU 7I5-CcIaqDM sMbK6ZDzQtY zM0gLGSS3Gs wjB54quOQWI 02-A-VawCRM n9QWsYUXopo wEm3x7nfLIo 6snqGRsUj1U q0Rol2r_AWo BmRjTBiPvyY QJ1OBCSwDN4 7jRWW-1maEg bex9IpHftMA aWN2eVDyeVs QRmrC782T4Q _zhT6NJPG1w 3_XVHImKB_M 90MTD_rll4Q tLRDnCidzgs I6UE3aQB0kU kce9sm7zoWk xKDmWCkJkBM DLabzJRt5yA Qcfob-U1q9E 8XkDRO8s9Ns aLebS68rh5k BPit88Eus7c ObbsoCZQclQ eg1vWbNtge0 s9cHhhwLf0s vLk4XszsLCs hzLHsgCRko4 5yXqAi9zRl0 KAG4Ih0yVYo 2x1Inkx-yFI 2_Owl2e8nIg z1txlDyMeuI sSBwf7Gt1kk 3BuPTF2o0ig y5aOuJDvHm0 MXHQjB3L7cQ 7sutdxhKtrk LE45MyN1VQs IS1ouj6Xt5Q wmISAzAm-4s kP3ElYEhET0 _nJwpcs0Zcg O3I1Y1aKaak nCVFjFZPRXk 9lblDQEYBA8 tQzuV_Zwp4U JgK_OugNW3k gObi7GE9u84 YKwQZCliFxs WL2ZHHB9q08 Jf_MhBojVYI 14zxilnXz2A B6JpjDXHx-k cuPnBJB5zmc apre8lnFZp4 3ZwetM8nhxM XFYa_jzwU38 _c3YvBn83Ng fgUf6X3bRVc RorwVcHrC24 Oph6QTP5V1k lhO1236sFdw
0hBuzP9xLSM 2_nxD79pJDY MWp2OZ0EmdI Iwoi8CLls0w YkvmeVOJQP0 z167pjVLax0 9jscG4A_kEI S2qCOSV4mqA VDqPrfuNdfo xIpakuGmkfs rcwmhV67eO0 u4x9mqUCbA4 Xr3MMoCZPIk D2cmTpKPV8Q ibr6_0KemDQ YSBi43hLpyQ opAF9KdhkaA pb-BHP9Ns6Q OtjQmZAbPT0 laKYy1IwUbk jIbRa4QyubY Ls2qq7qWRBk XQbOZc3I5y8 r-Fg3PKbbwU -kuAkF9Zx0s sR5ItzL8KRo vbFPpxOuYfk pwcEMg2Ma1E Srv0Mhx376Y wYHypiVL51Y Ef8yMSXbmH4 xmYJeloyoUo crb4KYOafHc lGbeuzk-lKs fKiE-knz2D8 KvPQ_OiMnFQ Gv70G73awMk 5m1QOZTfh60 _y9mXx1Obw8 VFJIbnsvTVU avVvyMXpyLg Nkr3AuVJ27E rYSP_D-Xauw i6y8tCvsYqU tWtPZOLZFpc j-jp-rCrc74 w8QfbNnaQxI 5WAwIWq679o OF0svRAUVcQ -OsuRTKgdlU 5Si3lYvOWmA KXhjSJFGFEk asBiVGI2LDA I07Ra-BMeD4 pfNeTrQrBAk R4PlU-3j0QY kNMIQx8HX-U ldQoiUIsavU VTU0UXZmfeQ hxmVo59f9jA rEV6XUEbgAs fEr5PD1_slQ KNth6mE81Ks R0upmTyv4ss TVlyyAJltLY PwAg5MYkyhc wsOt_0K5rKM jfHqsCbEZDg 3i5tRsGUFAs A4ekbRRugLc riNSvdM_R_4 kC79hSgM0dI oJzuLAAw3oI U8vN67zK-pw zQpOLnfnkIE NQ9pG5EyXCk I6tI8bNxDsc JJS4pYnqEUc z_T2ZKOSmeE Gaused52rB0
OkVO2r2oquE L__bJqSOsk4 9QntR7Dx_eo kY9MvAcarjU 6yIdLQe4JlI mLwaRoih_3I 6q-iHnENKNw 0Y6mI7gG8gs DtejItV1lfc lLCnhe6d-V8 QGtO9gePWe0 g1QgaUI8HT4 JZxbYxhibnA dg82OG18am8 1XJWXyYaxOU pjmVVWDdjso pqF5jj205TU rzLbK2JtVI0 kMH_WBX5kfE fS9Icwql-Ks pxoNef5RTH8 Dh5eZxNEEg8 T1PStI-MGGg 53a-pLMI_TQ X13KhrdmIHg hEXTphS_H74 BLXsI-TrR0g 0dZrlXdJpPU -cfnvZvbiHg EZ7Ji9O0unA ZvRZV2J3tbc HhAl7br4JR8 G4xY48wqPb8 pzHIybmJUeo V-ApkGTXsmo hX8TYhOrFTU O8sB73NE5AE 52vagSqhUsU kQUSGmRgI3o 6wV1HFWtktA wVSqwS6g7d4 JXnQfmJ3emk z1OgbWPi4sw r04Xn_9IHYo LHwlbw_dh9I S4DQMAMpO1A l9JUV0svqx4 T3Lo1F9-rnw KJ8xMFEWbYw ZykawUD2HJQ ZH4wOnHhAHc G7AxR7p4wtQ UNI_xCJb7fM MKq2vv9IZDU Ck-pprfSgzc miYrzTAuI-o p2Quh79leZE k2Z6VFvFrFc q8OLpgRDFKg _DgCaJmDZt4 oY7MmpOVwSA 7kTJGqKvD4g Ay9gKiGJBCQ Z1iQ1aZk824 GPo1vtKg4j8 lNS-2MgXDIo 8DTDXD-zNGY YC5q-aBA-YY I-M5px-9r4E AZCDJpE_HB0 Nw3JwZE3np0 24ISGUgzQ3U QhujpezHQCQ 6RhHfJmNl2g 6vqWTN9CF1g ppSHfjU5z6A L55nGxpGbzc dkiD_wzIxeo Sxqqq2rQyq4 vWpnyNT1k0o
Rqx2LvT6Un4 x5wHiw1ZgA4 A2ah_oXmRps RY1JzMUh3cM PevSXOhmE5Y 6DyzBSdb-6E GK-HVxjUvk4 lhSCTlWkeJk SpJz2NnzSiU X7M9Ft6hKlo ftbayZ6R3oo QWuOad8rvoY vuIgb3kDWj8 U1tSRpUloDo WU6hXnsWm1k r5pbRxyYt7I PUoCouysPTM kil61mujW0k xTmDDniUJd0 FKd31bOxc9E ndKurWM32YE sU2uapOqh5o 6Y3BTtA_XB8 tKolZcNkOxU 2Fwtpm-U3pc uXEgydwx-1M Q5ERDbyltVk i9i6TaE7lJ0 he5ZHZdnsoA Rmq0RnyaoVc iTk9dz5GMio 6xc2BRqbkMQ aEN0HWSK79Q efGuxX4K1Hw rzZnqR2jBfM r5XHXxWgD0c 8h3-5dzV6bc 7XduHISyVr4 Q06BgZaeH-E edsfTc77tGg LA0zE9K5QHA RFITzfTV6ZA ZAwPtj9sAjs rHyuGFADgWY 2BtAKSPDfgc OFwYjgy2Nio yUi2BfGdkTs WGw3rfNYczc oB1jB8HLK1w JzdWtrNNFqw 5nYava2qqGs ZbrMMvzZbBk HEo3D_eSOlQ pg9L_ctjRVI X7gi-MGmkMo _35BYodz7bg XFu8gKRNBT4 M8684FXerWw jEd5-VrFMtI 1GywX758eZA uPLnptcTdpg 8xRplIU8nfE 8ATz4t_z3l0 XZf7yrJwCeQ PLZK4-vgovw iVEaAtvrgE4 Yz8S6hzuMiA kro81CO9BnI oirsMBpQhCY j5WvBu97g5s QEBLN-xPFhs wdod8PEJe0U u37d4i5QTNA XcfTo7zP9lM zExcIUNsTa0 jLlDNQagyek UCL66SeD6eY aOcyFgMeB_4 aKia-tc17qI cOXYLEtfG94
hpkggDtkadY 1yfZlcBEdt0 1N84OcTid1M jghXL2W3JF8 F3J8cXybfMI ZNhUT1ad3MI Jptzld4RY3g y8yrwG9bu4o YDQFCwvvCMk tHS0VaPPjvc tbX4Rbxli0k R6K5SMNog6M S4TFbSICfys vQBpyaFjuew wECU-MPDbaY yF-pBnodUEY xuFXTxsdu8I U9smz3u7TL0 gvjRr91G1QY 3XyQatMecTw 2u7Z9Vg9ick YOLyqCHPq5w pNipl_zI0w0 Lw4BiHJTYMA v-Te_0Nlokc mkgxUPZ5yko 84JVyMHvbNc jHVk-eekSSM TipM55NT3Ho m8a9o4HxMBY bSAR_2WAJ4Q dOL__Cju9Is WakXotSjq1w tGr-23eKD0M 9ecZR8fSD1E 1rxO9qbCHyI 32mC9ktn1k4 wP1l6Mr-3us V8issGU-PRo R-CaDjFNPm0 HSL4ZNNIXaw TEmuoL97yHM JFfB-CGxGdQ dQAIQe0v6WY tVNipM5jfiA FYycEUzuBTg PnXetKm-dNU TuCo7dJ4zAA O2WyhqG4lfc WpR4P_ciJck cZWWjWnZZp8 YATiFvPYvHE v_-S2e60Joo wuaQwsyzm2k Ao3r7m66gEo Kqn7TQ7a1pQ mTGNE3oeyac lZg8nTutKLg jofxSswT-Ik zVTvGPhSLFY Zxd1ACQjFXA o_3GTKfnXrQ eCh0fLv2YMw tB6AjD1bjfg Qam4IMKMUAs TznhUxO8N48 CqPa6X6TMQY D0edBOrMRYw 9-WC1URqass NyD7sxW5dEQ HAZg466vNno Pup12L5BcQI bsK3lrDgS0Y C-WgXpy4taQ PV-nw1318Gk SESAXCD20y0 5YlQwxEdL-8 vsAUOwU62JA N4z1QouF2xI 16L1rVKu4D4
pWfpWppt1lw y8pR1bjBNZw eI4uM77K8qs gOE4JfUEq8s s9yYb4jmrek kOrhjxf8PR4 PaM-SyfJQi0 tllhHO1FX7k m2OXF3EeZko 2k80akZIFQY h0cQpXpBqq8 _0bkAgcQGro rdoccaS5o3c O2Zm0COv_SY IWv1issl2ow EZ01HsbQAj0 QreHmkYtEcA _Vy0zqkB0_o ANviy-EoIqE 8u_NmIkSp30 Yh57OuYiHL8 RnTl03MZLCk NUKGLTEvWoc L2UsKoVCgeQ IGLmMfDSQlI C3HbRnRMuk8 HekAiZ7_-a8 xDhQDQ3z-ac pI_XPEuVE5g Zc7JQ9htKI0 LLhFu8agsog CAYf9EdA5zA Ai0Y18IzQdw emPRAgmdZuc oZxGjuNf5P0 w80ro4zFxm8 zpainWmX9d8 5Vx8oVn5BIs aSWq7r04gOI 1ZVhgLmhJCE kNq4oKGiD5g ovv0AqNgIdk zZkKEg6sbBY oXn53HQxLRM Oi3Xt1kVJeI ggKx3ynHQ2w z6q9TvgCDwY 6wtKmFQiPhc TpwtYQ_1TTo uARKDPMpIKo LrUnmFI_aJM W_XKHCqFUFE pUOoC-ra2i0 aPKgQeBT2Qg tAIwILuIuKM hTUtO5TAvkE -B68F4DRmVI s_IdmcWuRyQ uX0M9epCxjQ 7mHPACtlqB0 0b0j25iw0J0 gn55fKKfxzc Yrh9JYD4uHQ WzbU_JlYKLo yY5qSTzxKLY SpCHOkXn8Us mwWNqoDdMjI dXz_qDCpl8c FfcPqZLSp8E QZ3s5d58HZ8 -qoYfvZY-XA aPRu9JnDSPU N6ZSgu8m2ig EY6yS30pugs 3HWaAQnORQY qeoQTyBAwHE udmaMZYPodU 0snwR2mxzoU rQyXuSEIxtA NoA3kQKk4Ew
IMsyxRyYe-0 kP1pIJNZAi4 BTgrwcglnEI dMNjL-pagko JmTYXVn9Pz0 cVoCewPh28c 2efKMaRCcvQ tdIB408y2sg i-qIamM_Yu0 5Zuh0jMRabE 49CWDQa_UV0 Flh7Hg_EIMs -9h1H7wD4W0 Eo-6xeJXJMo SOKe2cdqbPw hLIfB4yo9Fk r8M5XNuoShM kzd7y6qSBw0 kfsdYvR9dP4 6IhQZdpyzBo iAcyVqaLsH8 p-xvlb3MWmk 8H1Hr_Z8nYc xaxaJJXF9fQ _lfUqXLW_Bo gfXJUxOzofw kV5mmvJQy7A j7ceDhSrx2Y 21Q-5Uf1U-A rrRDxz4VNK0 rwS8QBXIYi8 o5yMeKv9SEA qH1HrpmDPVc NlAoBPJWTyw c3ic6GnlT7w TlsJFSAMbDs A4T0bDRdlfo bXgLfebM-eU NUi7BIjOe2M Pd0LcUU3HdM CBRAcnxS-W4 6WEjTH4_i5E YN12KewsqNI YGzMVSAn73I DAC6llysePo HiTnG8ymMfo pq_vtPzz7Mc yITHqLLsA8k h63pPKaS6tM EUR_TnlMVTo Kw6tPJJtghc XNVClim8NVc EAwU4WzbMns Q9l0wjq07Kk ZrAf-RTOGh8 dkC2W_Yci48 BIKoPN-U_Sw ULKyEREKGaM TMLpDyKQ8zQ s2xv70Bt-u0 rGK4GkVwOdM SRY4DTvNOUY 2dV-RUb7SZU QmHINhlV18Y D4p9PUXdch4 DXIwfxnGxQo qRuXnLkO4dc 6D9Vu8mnEdk UEtM81RaUNw vTaLEQnzYSs jNP3S6JldU8 EZrtMBxkYZg HjWRj1svmv4 eafQBlqvqT4 FeublzydU7E 9-TP64luYww oRtlb39cdY8 UHJ8iAE9230 TjWCR80l3Fg BkzoTSTEuC4
smuHfzgZEDI eY8A6spd9Zs pPhF7y8xnR0 WddopDPvvxs s9NEHbP34f8 _q7r04Vf2-c WOsbZgQWbds 0MJOn_6X-eU XrLNnK5Mq6Y KlnHjug5ExQ pEWUNtOVUOc BoQj-TwxHEk rKAgL9p5Rsg -t6EIY6-sj8 crzUQPNkxMQ Ha0zUQZlMaE 4kLZ89XiDmA vVOEhQjp9rE b-Nj3t0ATOU 0lmQAwdJ_NM wjjonldr0RQ rwJXqUIan_o pVDMjuBcdxg OOcewF0vgDE HiUDZotpR7c 7L8oIV30nxY xhBOUaMHIso 25kpzYHqX7g BdRZ2qPMGZg 8insPHb4o_s 0eEX9N-ty64 k5BjnFOFkag XMWtX6JcHDA q-yjVAoGOS8 ECl4PRmD6_E wzbgBbQpr8Q clC9nflm0UI 0QcPG_ozRa0 tSwh3e1aX1Y fsDa7eqySJk WO1J0JHYyAY 7CSlKeYTxv8 xUm2lRDjZ30 ZP4GVDP4e-0 9trfwoEqvcc 0UIFk8NJgGE np_S6hdOjVU b1ac6P8tjH4 uM6TdvfCVcg 1a8AUNA2ceg x9ImwakWiTI pO1E0nZxads s03tvcEUx1g HxmeJDnFidg gufZHG0aZMA AFdfgmh9qtk xkzVRYn00Rw IC0JiOkvVsQ ZMpC2ZZxWq0 rede1mobHEw 4e40cLsZ-HM vnOJSuhcjog KpErxkar9jY dLGOs-vTe9U shLqEe5Gtpg O5EcBy0Jza0 6zwwCioB-as osJirrPfIr0 qV9sctV4CM8 6TJRgQT8fQI oIgVIA-CJ4M ZPVIvojV8qw ET68tLl6AIY XyP6epnJ81A gtxlVqhRFWo yU75Rcx2N1Y LN42Bo1MvUI Ab2iiebYeko RqbmQs23Jhw WAHDlC3B3eg
pIDa9Q58yJU VtByOqKfjOU 1QnHrADFSfI WcQZuXyonzc oS6cgRhP0LA IOPs6m66Ai8 o524LDEmBwM tcUuPm0LX00 UhRjr1MRN0c k9rNFhgw0_o xyna_2L95cM GHKXnaM95RY Hk59ptFBi5s SxEP6P44RIA nwHxxgzzQek T4lmWZKez8g wYqw3Z0W_LE N4cPxmTKzPA 7154kVV534g _lvHWunVFFw l8AlzUCQPpM eJtbB-QtkH8 8jdkNfC-aU4 Bvp71678qJQ jmLK56H5gmY 3GVaOK_z_VU mRfTCEH26ho AA27VzSJes8 P4vFE6CrwVw -eO-u7SASrw vyvZDwkrS2Y UlM6alDIKsU TpKESegM2i0 1GaeWCx_KbE lpOfY3N_Y_0 DwS1r_iWL4Q 62T6i9E8VJQ
`;

const FEATURED_SHORT_TITLES = [
  "Panoramic Sunroof Maintenance #cars24",
  "15000 me Flex Fuel? #cars24",
  "Sugar In Ethanol-Blended Petrol? #cars24",
  "Is Left Overtaking Illegal in India? #cars24",
  "Ethanol Brake? #cars24",
  "Why are Car Names So Long? #cars24",
  "India Might Just Skip EVs #cars24",
  "Tata - Jeep Bhai Bhai! #cars24",
  "Car Names Are Sad Now #cars24",
  "Jaipur's Most Unexpected Billboard #cars24",
  "Does a 1 Lakh KM Celerio Still Run Fast? #cars24",
  "Car Guys React to a sus EcoSport #cars24",
  "Increase AC Power Hack? #cars24",
  "Black Tape on Headlights? #cars24",
  "Petrol E85? #cars24",
  "Car Guys React To A V6 Dodge Durango #cars24",
  "Flex Fuel WagonR #cars24",
  "Car Buying Permission? #cars24",
  "Is this the BEST Tata Car? #cars24",
  "Maruti is at it AGAIN! #cars24",
  "Never Buy an SUV Again! #cars24",
  "Engine Bay Super Cleaning #cars24",
  "Operation Promise ft. Gaurav Gera",
  "The Sub-4-Meter Logic #cars24",
  "Can this Car BEAT the Fortuner? #cars24",
  "Why Always Thar? #cars24",
  "How is THIS Possible? #cars24",
  "How to Increase Petrol Engine Life? #cars24",
  "Weapon In Your Car Legal? #cars24",
  "Small Cars Comeback? #cars24",
  "Ameo - Made For India Volkswagen #cars24",
  "Indias Last Diesel Hatchback Tested! #cars24",
  "Why Is Hyundai Losing India? #cars24",
  "3-Cylinder Vibration ? #cars24",
  "Is Maruti a Mastermind?#cars24",
  "Kia Syros - ? #cars24",
  "Super Cleaning Your Windshield! #cars24",
  "Old Verna vs New Verna - Speed Test #cars24",
  "Jimny - A Daily Driver? #cars24",
  "This TRICK will Save you Lakhs!#cars24",
  "A Very Special Tigor - JTSV Tigor JTP #cars24",
  "Renault's NEW Engine Strategy?? #cars24",
  "Mobilio - Honda's MPV #cars24",
  "These Interiors are a Class Apart! #cars24",
  "Baleno RS - A Lukewarm Hatchback #cars24",
  "Is this the END of EVs? #cars24",
  "NEW Nissan Magnite - Barely Facelifted! #cars24",
  "100% Ethanol Blending?? #cars24",
  "How FAST Is Tesla Model Y Really? #cars24",
  "Is MG Now a Desi Brand? #cars24",
  "Leather Car Seat Cleaning #cars24",
  "Hood Scoop on Every Car? #cars24",
  "Pollution Norms ka GAME OVER? #cars24",
  "EcoSport Comeback? #cars24",
  "The End of Small Diesels! #cars24",
  "Is Bharat NCAP Rating Legit? #cars24",
  "Fuel Density ? #cars24",
  "Which is the 2nd Top Fuel in India? #cars24",
  "Who's at Fault Here? #cars24",
  "Biggest new car buying mistake #cars24",
];

export const CARS24_SHORTS: Cars24Short[] = CARS24_SHORT_IDS.trim().split(/\s+/).map((id, index) => ({
  id,
  index: index + 1,
  title: FEATURED_SHORT_TITLES[index] ?? `CARS24 Short ${index + 1}`,
  url: `https://www.youtube.com/shorts/${id}`,
  thumbnail: `https://i.ytimg.com/vi/${id}/oar2.jpg`,
}));
