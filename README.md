![image](https://github.com/user-attachments/assets/3ca8ada3-6e3a-4c36-9543-cb174d1483e3)

## Contents
1. [🐰 Project MoonRabbits 소개](#-project-moonrabbits-소개)
2. [🌕 게임 시나리오](#-게임-시나리오)
3. [🌕 게임 소개](#-게임-소개)
4. [🌕 게임 실행 방법](#-게임-실행-방법)
5. [🌕 게임 플로우 차트](#-게임-플로우-차트)
6. [🐰 주요 컨텐츠 가이드](#-주요-컨텐츠-가이드)
7. [🐰 서비스 아키텍처](#-서비스-아키텍처)
8. [🐰 기술 스택](#-기술-스택)
9. [🐰 Contact](#-contact)
10. [🐰 참고 링크](#-참고-링크)


# 🐰 Project MoonRabbits 소개
![image](https://github.com/user-attachments/assets/0f1b534d-797d-4410-80a0-561ef2cb2caa)<br>
<br>안녕하세요 여러분!<br>
**저희는 내일배움캠프 Node.js 트랙 7기 1팀 rabbits라고 합니다!🐇<br><br>**
지난 6주 동안 만들게 된 멀티플레이 게임 서버와 클라이언트를 무사히 선보이게 되어 너무 기쁘네요.🤗<br>
지금부터 달토끼 프로젝트에 대해 차근차근 소개해드릴 테니, 귀여운 토끼와 함께 프로젝트 저희를 따라와주세요!<br>

## 🌕 게임 시나리오
<details><summary>🥕 토글을 눌러주세요! 🥕
</summary>
<br>

**유난히 보름달이 빛나던 어느 먼 옛날, 평화롭던 지구에 외계인이 쳐들어오기 시작했다!**

<br>산과 들판은 외계인들에 의해 오염되기 시작했고 곳곳에 던전이 생겨났다.<br>
깊은 산속 골짜기에 위치한 **달토끼 마을**은 그나마 안전해서 사람들이 모여 살고 있었는데…,<br>
마을의 나루터에서 배를 타고 나가는 순간 외계인이 습격하기 때문에 안심은 금물이었다.<br><br>

외계인들에 의해 오염된 땅이 **달토끼 마을**을 조금씩 침범하는 상황.<br>
그리하여 어른들은 말했다.<br><br>

**"마을 밖은 위험해!"**

설마 우리는 죽을 때까지 마을 안에만 갇혀 살아야만 하는 걸까? <br>
**아니, 우리들이 힘을 합친다면 흉흉해진 이 세계에서도 살아남을 수 있다!**

몬스터들에게 빼앗긴 마을 땅을 되찾는다면, 허물어진 보금자리를 재건할 수 있을 터.<br><br>

지금 바로 파티를 모아서 위기에 빠진 달토끼 마을을 재건해보자!

![image](https://github.com/user-attachments/assets/18c8965b-2f3c-42a2-a2a0-b53fdd599bbe)

<br>
</details>

## 🌕 게임 소개
<br>

**저희 Project MoonRabbits는요!**
- **최대 5명의 플레이어**가 **파티**를 맺고 **몬스터**들로부터 살아남아 **보금자리를 재건**하는, **생존형 파밍 게임**입니다.
- 약 100여 명의 플레이어가 접속할 수 있는 서버에서 **같은 파티원끼리 협동**하고, **다른 파티와는 경쟁**할 수 있습니다.

![image](https://github.com/user-attachments/assets/de935e51-bcd6-4c56-9c23-05b2daaf17ea)
<br>
## 🌕 게임 실행 방법
**[1] 아래 링크에서 zip 파일을 다운로드 받아주세요.**<br>
https://ppiok.itch.io/moonrabbits
<br>**[2] 압축을 푼 뒤 exe 파일을 실행해주세요.(Windows PC 환경만 지원합니다.)**
<br>**[3] 게임을 즐겁게 플레이해주세요!**

## 🌕 게임 플로우 차트
<details><summary>🥕 토글을 눌러주세요! 🥕
</summary>
<br>

![image](https://github.com/user-attachments/assets/fd3f37e7-b14a-456e-bbc1-ae19f8ac941d)<br>
<br>Project MoonRabbits는 크게 두 가지 흐름으로 살펴볼 수 있습니다.<br>
<br>바로 **공간**과 **시간**입니다.<br><br>
![image](https://github.com/user-attachments/assets/4ad25e30-56ab-4055-9383-b34793294dcf)<br>
<br>게임에 접속하시면 마을에 태어난 플레이어를 만날 수 있으실 겁니다.<br>

<br>마을에선 채팅과 감정표현을 통해 다른 플레이어들과 소통할 수 있고 파티도 맺을 수 있습니다!<br>

<br>어떤 컨텐츠가 있을지에 대한 호기심은 게이트나 빠른 이동을 통해 마을 밖, 섹터로 나아가게 만들어주죠.<br><br>
![image](https://github.com/user-attachments/assets/67b20eff-8844-4e81-94b3-dc72187a2b09)

<br>섹터에서 몬스터도 만나보고, 파티원들과 협동하며 자원을 채취하고 나면 주머니와 레벨이 두둑해지실 겁니다.<br>
그렇다면 이제 무엇을 할 수 있을까요?<br>

<br>바로 아이템을 제작하고 나만의 보금자리를 꾸미는 겁니다.<br>

<br>그러기 위해선 평화로운 마을로 돌아가 모루에 망치도 두드려보고 보금자리로 이동해서 가구도 제작해야겠죠?<br>

**<br>마을에서 섹터로,<br>
섹터에서 마을로.<br>**

<br>자연스럽게 순환하는 게임을 만들고자 했습니다.😁<br>

</details>

## 🐰 주요 컨텐츠 가이드
<details><summary>🥕 컨텐츠 흐름 🥕
</summary>
  
- 섹터를 탐험하며 자원을 채취할 수 있습니다.
- 섹터를 순회하는 몬스터들을 피해야합니다.
  - 몬스터와 접촉 시 체력이 한 칸 감소하고, 체력 전부 소진 시 10초 동안 탈진 상태에 빠집니다.
  - 탈진 상태에서 체력을 회복하지 못한다면 마을로 강제 귀환됩니다.
- 파티를 맺어 서로를 보조하거나 지원할 수 있습니다.
  - 탈진 상태인 파티원을 구조할 수 있습니다.
  - 몬스터를 대신 유인하거나, 파티원에게 접근하는 몬스터나 플레이어 등을 기절시킬 수 있습니다.
- 다른 파티 또는 개인 유저들을 방해하며 자원을 독차지할 수 있습니다.

![image](https://github.com/user-attachments/assets/fede3205-563a-439a-9009-aaf4d58bc5ff)
![image](https://github.com/user-attachments/assets/3ea694cd-4e2f-4460-84e3-f12cc175bc6f)

<br>
</details>

<details><summary>🥕 플레이어 스킬 🥕
</summary>
  
**귀환**
- T를 눌러 시전히고, 5초 간 방해받지 않거나 움직이지 않으면 마을로 귀환합니다

<br>

![image](https://github.com/user-attachments/assets/37054a16-53be-4687-9e01-b6c6a6f8606b)

**기절 폭탄**
- Q를 누르면 커서 위치로 기절 폭탄을 던집니다.
- 폭탄은 지면에 닿은 뒤 1초 뒤에 폭발하며, 지면에 닿지 못 한 채 5초가 지난 폭탄은 자연 소멸합니다.
- 재사용 대기 시간은 5초입니다.
- 폭발 범위에 닿은 다른 플레이어와 몬스터들 모두를 3초 간 기절시킵니다.
  - 플레이어들의 특정 행동을 강제로 취소시킬 수 있습니다.
- 시전자 본인과 시전자의 파티원에겐 영향이 없습니다.

<br>

![image](https://github.com/user-attachments/assets/d3326352-550d-4fa0-9499-d6cafc75a2f0)

**덫**
- E를 누르면 시전자의 발 밑에 덫을 설치합니다.
- 한 플레이어 당 최대 2개의 덫을 설치할 수 있으며, 발동되지 않고 20초가 지난 덫은 자연 소멸합니다.
- 재사용 대기시간은 5초입니다.
- 플레이어를 충돌 감지한 덫은 폭발하고 대상 플레이어를 5초 간 기절시킵니다.
  - 플레이어들의 특정 행동을 강제로 취소시킬 수 있습니다.
- 시전자 본인과 시전자의 파티원, 몬스터를 대상으론 발동하지 않습니다.

<br>

![image](https://github.com/user-attachments/assets/d9e5b50e-7d31-4fef-8de7-80a216488d89)

<br>
</details>

<details><summary>🥕 파티 맺기 🥕
</summary>
<br>

**파티창 주요 기능**
- 파티를 생성할 수 있습니다.
- 닉네임을 통해 파티에 초대할 수 있습니다.
- 파티 탈퇴 및 해체와 방출이 가능합니다.
- 파티 목록 조회가 가능합니다.(최대 100개)

<br>

![image](https://github.com/user-attachments/assets/aed19e7f-f17e-4bb7-ac55-8186f62f88fc)

<br>

**파티원 정보창 주요 기능**
- 다른 섹터에 있어도 파티원의 현재 정보를 알 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/5ee835cd-ce16-4dc1-ae4c-a5e9f630775f)

<br>

**파티를 통한 협동**
- 같은 파티원의 덫은 밟히지 않습니다.
- 같은 파티에 소속되지 않은 플레이어만 덫을 통해 기절합니다.

<br>

![image](https://github.com/user-attachments/assets/8fc5ab9f-0b3f-4130-9843-57bddf6aaaef)

<br>

- 같은 파티원의 기절 폭탄에 기절하지 않습니다.
- 같은 파티에 소속되지 않은 플레이어만 기절 폭탄을 통해 기절합니다.

<br>

![image](https://github.com/user-attachments/assets/b704e880-ba28-4389-a01e-7fc6a690dd32)
![image](https://github.com/user-attachments/assets/153f66bf-3253-436b-84df-05eaaedc2d86)
![image](https://github.com/user-attachments/assets/094b91ac-7870-43ee-afe0-cb10629b7f6f)

<br>
</details>

<details><summary>🥕 자원 채집 🥕
</summary>
<br>
  
  **나무**
- 도끼를 장착하고 자원을 획득 할 수 있습니다.
- 원의 흰 부분을 가리킬 때 다시 상호작용 하여 성공하면 자원을 얻습니다.
- 지역에 따라서 나뭇가지, 평범한 나무 판자, 단단한 나무 판자 등을 얻을 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/52bf3057-1dff-441f-b9b7-4b298bdde747)

<br>

**돌(광석류)**
- 곡괭이를 장착하고 자원을 획득 할 수 있습니다.
- 원의 흰 부분을 가리킬 때 다시 상호작용 하여 성공하면 자원을 얻습니다.
- 지역에 따라서 구리, 철, 금, 다이아몬드, 돌, 대리석 등을 얻을 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/d2d49e76-13ec-4e7b-8c13-17178b07a0e6)

<br>

**팁**
- 폭탄을 잘 활용하면 쉽게 몬스터를 기절 시킬 수 있습니다.
- 흰 부분이 너무 멀면 이동으로 취소하고 다시 상호작용을 하는 것이 더 빠를 수도 있습니다.
- 흰 부분의 시작 점에 맞추기보다는 끝나기 전에 누르는 것이 1~2프레임을 더 확보할  수 있다.

<br>

![image](https://github.com/user-attachments/assets/7ce2e063-1c67-4c8e-81f5-bfa29a9c165d)

<br>
</details>

<details><summary>🥕 아이템 제작 🥕
</summary>
<br>

**아이템 제작 기능**
- 제작 UI (단축키:C)에서 확인 가능
- 제작 수량을 선택할 수 있고 제작 수량에 따라 현재 소지한 재료와 필요한 재료를 보여준다.
- 제작 버튼을 누르면 인벤토리에서 재료가 소모되고 제작이 시작된다.
- 제작이 완료되면 인벤토리에 제작된 아이템이 추가된다.
- 제작 중간에 UI를 닫거나 다른 작업을 해도 제작은 진행된다.
- 제작 중간에 비정상 종료 등으로 제작 완료를 못하면 소모한 재료가 복구된다.

<br>

![image](https://github.com/user-attachments/assets/552184c9-cac5-485c-abea-8dc54de8b8a7)

<br>

<br>

![image](https://github.com/user-attachments/assets/5e0c85e8-e05d-46b7-911f-89f47de85f3f)

<br>
</details>

<details><summary>🥕 플레이어 성장 🥕
</summary>
<br>

**레벨 시스템**
- 자원 채집을 통해 경험치를 쌓을 수 있습니다.
- 매 레벨 당 일정량의 경험치를 획득하면 다음 레벨로 성장합니다.
- 레벨업 시 3 포인트를 얻고, 포인트를 투자해 원하는 능력치를 강화할 수 있습니다.

**능력치 시스템**
- 플레이어가 성장시킬 수 있는 능력치엔 스태미나, 숙련도, 이동속도가 있습니다.
- 스태미나는 달리기 시 소모되는 게이지로, 능력치에 비례해 최대 게이지가 상승합니다.
- 숙련도는 자원 채집에 대한 성공 판정 범위를 증가시킵니다.
  - 성공 판정 범위란 자원 채집 시 활성화되는 원의 흰 부분을 뜻합니다.
- 이동속도는 플레이어의 기본 이동속도를 증가시킵니다.

<br>

![image](https://github.com/user-attachments/assets/ae979af8-6c0e-473c-86f8-e0bca2c4edbc)
![image](https://github.com/user-attachments/assets/dc1f40e8-7d82-4ddb-adf8-1cb0c594f18e)

<br>
</details>

<details><summary>🥕 하우징 컨텐츠 🥕
</summary>
<br>

**가구 배치**
- 화면 하단의 UI에서 아이템을 선택해 배치 모드를 시작할 수 있습니다.
- 클릭 시 아이템의 미리보기 형태로 나타나며, Q 와 E 를 입력해 원하는 각도로 아이템을 회전시킬 수 있습니다.
- 한 칸에는 하나의 같은 종류 아이템만 배치할 수 있습니다
    - 다른 아이템이 배치된 위치에 추가로 배치하려는 경우, 미리보기가 빨간색으로 변하며 ‘배치할 수 없는 상태’ 임을 알립니다.
    - 다른 종류의 아이템이면 같은 위치에 배치가 가능합니다.
- 모든 배치가 완료되었다면 ESC 를 입력해 배치 모드를 종료할 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/00627030-cb6d-4883-94cb-a09d721ef122)

<br>


**가구 제거**
- 화면의 UI 중 우측 하단의 ‘쓰레기통’ 버튼을 클릭 해 제거 모드를 시작할 수 있습니다.
- 아이템이 배치되어 있는 곳에 클릭을 하게 되면, 해당 위치의 아이템은 제거됩니다.
- 아이템이 배치되지 않은 곳은 선택할 수 없습니다.
- 모든 제거가 완료되었다면 ESC 를 입력해 제거 모드를 종료할 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/9d4b120f-e5ac-48be-8c0b-3b7414115b99)
![image](https://github.com/user-attachments/assets/75b0aa1b-da92-47d9-96f2-54e6ab47e63e)

<br>

**카메라 이동**
- 배치 모드가 시작되지 않았거나, 종료된 ‘일반 모드’ 에서는 카메라를 자유롭게 움직이며 나만의 집을 구경할 수 있습니다.
- 조작키는 다음과 같습니다.
    - 카메라 이동 : W / A / S / D
    - 확대/축소 :  마우스 스크롤
    - 시점 이동 : 마우스 우클릭 홀드 + 드래그

<br>

![image](https://github.com/user-attachments/assets/db64872b-ab6b-4c0e-b454-374532a9bcd4)
![image](https://github.com/user-attachments/assets/85f47156-569b-4df3-b380-0bf764fe5e94)

<br>

**스크린샷 저장**
- 마음에 드는 아이템이나, 눈으로만 보기 아까운 광경들은 사진으로 남겨 저장할 수 있습니다
- 화면 우측 상단의 ‘**사진**’ 버튼을 눌러 현재 화면 시점을 저장합니다.
- 저장된 사진은 **‘바탕화면/ScreenShots/”ProjectMR_Screenshot_{날짜}”’** 의 이름으로 저장됩니다.

<br>

![image](https://github.com/user-attachments/assets/490fdd6c-b0f4-4ab9-af27-2e5cdbf5b0d6)
![image](https://github.com/user-attachments/assets/800931c2-f2e7-42f5-aab5-6285a82d594c)

<br>

**배치 저장**
- 나만의 집에 배치된 아이템들은 일정 주기마다 저장됩니다.
- 저장된 아이템들은 서버로 전송되어 게임을 종료한 이후에도 항상 같은 상태를 유지할 수 있습니다.
- 또한 화면 우측 상단의 ‘체크’ 버튼을 눌러 저장 주기를 기다리지 않고 직접 저장할 수도 있습니다.
- 게임 종료 시에도 현재 배치된 아이템들을 자동적으로 저장하여 배치 상태를 잃어버리는 돌발 상황을 막을 수 있습니다.

<br>

![image](https://github.com/user-attachments/assets/ad476d5d-0763-4007-b450-c3cd259f1c83)
![image](https://github.com/user-attachments/assets/57f10f66-79d0-4b5f-866a-a09ebc412e33)
![image](https://github.com/user-attachments/assets/5974f66c-13a0-43b1-bcb3-869ffc8f26a8)

<br>

<br>
</details>

## 🐰 서비스 아키텍처

![서비스 아키텍처](https://github.com/user-attachments/assets/b3a82d03-3e27-4be5-b53b-b0657c6f880e)

![image](https://github.com/user-attachments/assets/410f2678-848c-4868-8e72-b02c9d07f431)

![image](https://github.com/user-attachments/assets/e3833e98-a720-4d0f-b9e9-9e42443080b8)


## 🐰 기술 스택
**Client<br>**
<img src="https://img.shields.io/badge/unity-%23000000.svg?&style=for-the-badge&logo=unity&logoColor=white" />
**<br><br>Backend<br>**
<img src="https://img.shields.io/badge/node.js-%23339933.svg?&style=for-the-badge&logo=node.js&logoColor=white" />
**<br><br>Database<br>**
<img src="https://img.shields.io/badge/mysql-%234479A1.svg?&style=for-the-badge&logo=mysql&logoColor=white" /><img src="https://img.shields.io/badge/redis-%23DC382D.svg?&style=for-the-badge&logo=redis&logoColor=white" />
**<br><br>Infra<br>**
<img src="https://img.shields.io/badge/amazon%20aws-%23232F3E.svg?&style=for-the-badge&logo=amazon%20aws&logoColor=white" />
**<br><br>DevOps<br>**
<img src="https://img.shields.io/badge/docker-%232496ED.svg?&style=for-the-badge&logo=docker&logoColor=white" />
**<br><br>Load Test<br>**
<img src="https://img.shields.io/badge/apache%20jmeter-%23D22128.svg?&style=for-the-badge&logo=apache%20jmeter&logoColor=white" />

## 🐰 Contact

| 이름  | 블로그 주소                                                                   |
| --- | ------------------------------------------------------------------------ |
| 최슬기 | [https://princeali.tistory.com/](https://princeali.tistory.com/)         |
| 김정태 | [https://explosion149.tistory.com/#](https://explosion149.tistory.com/#) |
| 송원빈 | [https://bb201802.tistory.com/](https://bb201802.tistory.com/)           |
| 이기환 | [https://wakelight23.tistory.com/](https://wakelight23.tistory.com/)     |
| 김종하 | [https://foreiner852.tistory.com/](https://foreiner852.tistory.com/)     |
| 남민우 | [https://puudding.tistory.com/](https://puudding.tistory.com/)           |
| 김동욱 | [https://velog.io/@dwook1637/](https://velog.io/@dwook1637/)             |

## 🐰 참고 링크
- 프로젝트 브로셔 링크<br>
https://www.notion.so/teamsparta/Project-MoonRabbits-1b12dc3ef51480288bbfc6a90c1658a5?pvs=4

- 최종 발표회 PPT 링크<br>
https://docs.google.com/presentation/d/1c_xilWJN3rvDnO2JAaqnyBDmwCRb7s59ceHvIWYPPKs/edit?usp=sharing

- 시연 영상<br>
https://www.youtube.com/watch?v=ahCP40IVNQI&t=73s
