    // Create particle effects
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('img');

         particle.src = "img/balloon.png"; // ảnh bóng của bạn
         particle.classList.add('particle');
            // Random properties
            const size = Math.random() * 40 + 20;
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 15;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}vw`;
            particle.style.top = `100vh`;
            particle.style.objectFit = "contain";
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particlesContainer.appendChild(particle);
        }
    }
// --- Level 2 modal & pause control ---
let level2Shown = false;
let gamePaused = false;

const level2Modal = document.getElementById('level2Modal');
const btnProceedLevel2 = document.getElementById('btnProceedLevel2');
const btnCloseModal = document.getElementById('btnCloseModal');

function showLevel2Modal() {
  if (level2Shown) return;
  level2Shown = true;
  pauseGame();
  level2Modal.classList.add('show');
}

function hideLevel2Modal() {
  level2Modal.classList.remove('show');
  resumeGame();
}

// Pause: remove input handlers or set flag checked in ClickDown/ClickUp
function pauseGame() {
  gamePaused = true;
  // disable click/touch
  clk.style.pointerEvents = 'none';
}

function resumeGame() {
  gamePaused = false;
  clk.style.pointerEvents = null;
}

// Placeholder: khi bạn đã build màn 2, thay nội dung này để chuyển trang hoặc load màn 2
function proceedToLevel2() {
  // ví dụ: window.location.href = 'level2.html';
  // hoặc emit event để hệ thống chính load màn 2
  console.log('Proceed to Level 2 - implement transition here');
  // tạm ẩn modal và giữ game paused (hoặc resume tùy thiết kế)
  level2Modal.classList.remove('show');
}
btnProceedLevel2?.addEventListener('click', proceedToLevel2);
btnCloseModal?.addEventListener('click', hideLevel2Modal);

    // Enhanced Preloader functionality
    window.addEventListener('load', function () {
        const preloader = document.querySelector('.preloader');
        
        // FIX: Kiểm tra nếu không tìm thấy preloader thì không chạy tiếp để tránh lỗi crash game
        if (!preloader) {
            createParticles();
            return;
        }

        // Create particles
        createParticles();

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 2000); // Simulate loading time

    });

    // Import existing game code
    const myn = document.querySelector(".main")
    const ball = document.querySelector(".ball")
    const clkTest = document.querySelector(".clkTest")
    const clk = document.querySelector(".clk")
    const play = document.querySelector(".play")
    const scor = document.querySelector(".score>h2")

    // Character selection variables
    let currentHeroIndex = 0;
    const _heroCar = [
        {
            img: "url('img/character/messi.png')",
            w: "110px",
            h: "110px",
            test: "messi"
        },
        {
            img: "url('img/character/ronaldo.png')",
            w: "100px",
            h: "100px",
            test: "ronaldo"
        }
    ]

    const SelectHero = ((num = 0) => {
        currentHeroIndex = num;
        ball.style.backgroundImage = _heroCar[num].img;
        ball.style.width = _heroCar[num].w
        ball.style.height = _heroCar[num].h
        
        // FIX: Căn giữa nhân vật trên cột hiện tại (Center player on current pillar)
        let currentWidth = (_flagWalls === 0) ? 50 : _walls[_flagWalls - 1];
        let currentRightEdge = 130 + py3; // 130 = 80 (margin) + 50 (width) của cột đầu tiên
        ball.style.left = `${(currentRightEdge - currentWidth / 2) - (parseInt(_heroCar[num].w) / 2)}px`;
    })


    // #########################################
    const _walls = []
    const _spacewalls = []
    const _getTagWalls = []
    let _flagWalls = 0

   const CreateWall = (( _randomSizeWall, _randomSizeWood) => {
        let _wall = document.createElement("div")
        let _Wood = document.createElement("div")
        _wall.classList = `tst h-[35%] bg-black bottom-0 relative platform`
        _Wood.classList = "gtst w-[4px] h-[0px] bg-black absolute origin-bottom duration-0 rotate-[0deg] bottom-[100%] right-0 stick"
        _wall.style.width = `${_randomSizeWall}px`
        _wall.style.marginLeft = `${_randomSizeWood}px`
        _wall.appendChild(_Wood)
        _getTagWalls.push(_wall)
        myn.appendChild(_wall)
    })
    // FIX: Thêm lề 80px cho cột đầu để không bị lệch (Add 80px margin to first pillar)
    CreateWall(50, 80)

    const GenerateRandomNumbers = ((N = 5) => {
        let _currentNumber = 100
        for (let i = 0; i < N; i++) {
            const _randomOffset = Math.floor(Math.random() * 100) + 1
            const _randomSizeWall = Math.floor(Math.random() * (80 - 20) + 20)
            const _randomSizeWood = Math.floor(Math.random() * (200 - 20) + 20)
            _currentNumber += 100 + _randomOffset
            _walls.push(_randomSizeWall)
            _spacewalls.push(_randomSizeWood)
            CreateWall(_randomSizeWall, _randomSizeWood)
        }
    })
    GenerateRandomNumbers();

    // valueClickMouse => "Each time the mouse is clicked."
    let _valueClickMouse = 0

    // 
    let _interval = null

    // _SumSpaceWalls => Sum of walls and the distance between the walls
    let _SumSpaceWalls = 0

    // _SumSpWl => We place the summed numbers inside an array and check them within a loop
    const _SumSpWl = []
    let py3 = 0
    let score = 0

    const ClickDown = (() => {
        _interval = setInterval(() => {
            _getTagWalls[_flagWalls].children[0].style.height = `${_valueClickMouse++}px`
        }, 0);
    })

    const ClickUp = (() => {
        clearInterval(_interval)
        _getTagWalls[_flagWalls].children[0].style.transition = "0.3s"
        _getTagWalls[_flagWalls].children[0].style.transform = "rotate(90deg)"

        _spacewalls.forEach((e, i) => {
            _SumSpaceWalls = _SumSpaceWalls + e + _walls[i]
            _SumSpWl.push(_SumSpaceWalls)
            if ((_valueClickMouse + py3) > (_SumSpWl[i] - _walls[i]) && (_valueClickMouse + py3) < _SumSpWl[i]) {
                score = score + 1
                scor.innerHTML = score

                // Add success animation to score
                document.querySelector('.score').classList.add('success-animation');
                setTimeout(() => {
                    document.querySelector('.score').classList.remove('success-animation');
                }, 500);

                _flagWalls = i + 1
                py3 = _SumSpWl[i]
                _valueClickMouse = 0
                setTimeout(() => {
                    ball.style.transition = "0.5s"
                    // FIX: Căn giữa nhân vật sau khi nhảy (Center player after jump)
                    ball.style.left = `${(130 + py3 - _walls[i] / 2) - (ball.offsetWidth / 2)}px`
                }, 500);
                setTimeout(() => {
                    myn.style.right = `${py3}px`
                }, 900);
                GenerateRandomNumbers(2)
            }
            else if (_spacewalls.length === i + 1) {
                setTimeout(() => {
                    ball.style.transition = "0.5s"
                    ball.style.left = `${(130 + _valueClickMouse + py3 - (ball.offsetWidth / 2))}px`
                }, 500);
                setTimeout(() => {
                    _getTagWalls[_flagWalls].children[0].style.transform = "rotate(180deg)"
                    ball.style.transition = "2.3s"
                    ball.style.animation = "fall 2s forwards";
                    ball.style.bottom = `calc(35% - 60px)`
                }, 900);
                clk.style.pointerEvents = "none"
                setTimeout(() => {
                    clkTest.style.display = 'flex'
                    // Add bounce animation to restart button
                    clkTest.classList.add('success-animation');
                }, 1500);
            }
            else {
                // 
            }
        })
        // reset 
        _SumSpaceWalls = 0
        _SumSpWl.length = 0
    })

    const wood = (() => {
        _flagWalls = 0
        py3 = 0
        _valueClickMouse = 0
        ball.style.bottom = `${35}%`
        ball.style.animation = "heroIdle 2s ease-in-out infinite";
        
        // FIX: Đảm bảo nhân vật luôn đứng đúng vị trí khi bắt đầu/reset
        if (typeof SelectHero === 'function') {
            SelectHero(currentHeroIndex);
        }

        clk.addEventListener("mousedown", ClickDown)
        clk.addEventListener("mouseup", ClickUp)
        
        clk.addEventListener("touchstart", ClickDown)
        clk.addEventListener("touchend", ClickUp)
    })
    wood()

    clkTest.addEventListener('click', () => {
        chback()
        score = 0
        scor.innerHTML = score
        clkTest.style.display = 'none'
        _getTagWalls.forEach((e, i) => {
            e.remove()
        })
        ball.style.transition = "0s"
        // Position will be set by SelectHero inside wood()
        ball.style.animation = "heroIdle 2s ease-in-out infinite";
        ball.style.transform = "rotate(0deg)";
        ball.style.opacity = "1";

        myn.style.right = `${0}px`
        _getTagWalls.length = 0
        _walls.length = 0
        _spacewalls.length = 0
        CreateWall(50, 80)
        GenerateRandomNumbers()
        clk.style.pointerEvents = null
        wood()
    })
    const back = [

        "url('backgr.png')"

    ]

    let ts = parseInt(Math.random() * back.length)
    let num = null;

    function chback() {
        let odn;
        do {
            odn = parseInt(Math.random() * back.length);
        } while (odn === num);
        num = odn;
        document.body.style.backgroundImage = back[odn]
    }
    chback()

    // Character selection functionality
    const lis = document.querySelectorAll(".aly>li");
    const divs = document.querySelectorAll(".aly>li>.cont");
    const hero = document.querySelector(".hero .p-4")
    const menue = document.querySelector(".menue")
    const scr = document.querySelector(".score")






        
        



    // Create hero options
    _heroCar.forEach((e, i) => {
        let heroDiv = document.createElement("div")
        heroDiv.classList = 'w-[115px] h-[100px] bg-white m-[5px] flex justify-center items-center bg-no-repeat shadow-lg hero-option rounded-lg'
        heroDiv.style.background = "white"
        heroDiv.style.backgroundRepeat = "no-repeat "
        heroDiv.style.backgroundImage = e.img
        heroDiv.style.backgroundPosition = "center"
        heroDiv.style.backgroundSize = "50px"
        heroDiv.setAttribute("hero", i)
        heroDiv.title = e.test

        hero.appendChild(heroDiv)
    })

    SelectHero()

    // Function to hide all divs
    function hideAllDivs() {
        divs.forEach((div) => {
            div.classList.add("hidden");
        });
    }

    play.addEventListener('click', () => {
        menue.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => {
            menue.classList.add("hidden")
            scr.classList.remove("hidden")
        }, 500);
    })

    // Add click event listener to each li element
    lis.forEach((li, i) => {
        // event
        li.addEventListener("click", (event) => {
            // Prevent the click event from propagating to the document
            event.stopPropagation();
            if (event.target.id === "char") {
                // Hide all divs first
                hideAllDivs();
                const div = li.querySelector(".cont");
                div.classList.remove("hidden");
            } else if (event.target.getAttribute("hero")) {
                SelectHero(parseInt(event.target.getAttribute("hero")))
                hideAllDivs();

                // Add selection animation
                event.target.classList.add("success-animation");
                setTimeout(() => {
                    event.target.classList.remove("success-animation");
                }, 500);
            }
        });
    });

    // Add click event listener to the document to hide divs when clicking anywhere else
    document.addEventListener("click", (e) => {
        hideAllDivs();
    });

    // Close button for character selection
    const closeBtn = document.querySelector('.text-back');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideAllDivs();
    });
