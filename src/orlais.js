document.addEventListener('DOMContentLoaded', () => {

    function orlais() {
        if (document.getElementById('orlais') == null) {
            orlaisCreate()
        }

        const LIGHTBOX = document.getElementById('orlais')
        const IMGWRAPPER = document.getElementById('orlaisImgWrapper')
        let currentImage 
        let currentWrapper
        let touchtime = 0
        let isMove
        let isClick = false
        let startClickX
        let currentClickX

        // set variables
        LIGHTBOX.addEventListener('mousedown', e => { startClickX = e.clientX; isClick = true; isMove = false; })
        LIGHTBOX.addEventListener('mouseup', e => { currentClickX = e.clientX; isClick = false; })
        LIGHTBOX.addEventListener('mousemove', e => { currentClickX = e.clientX; isMove = true })
        // touch variables
        LIGHTBOX.addEventListener('touchstart', e => { startClickX = e.touches[0].clientX; isClick = true; isMove = false })
        LIGHTBOX.addEventListener('touchend', e => { isClick = false; currentClickX = e.changedTouches[0].clientX })
        LIGHTBOX.addEventListener('touchmove', e => { currentClickX = e.touches[0].clientX; isMove = true })

        // add event to open lightbox
        const orlaisOpenActivator = document.getElementsByClassName('orlais-activator')
        for(element of orlaisOpenActivator) {
            element.addEventListener('click', () => {orlaisOnDbClick(orlaisOpen)})
        }
        

        // add events to next and prev functions
        document.getElementById('orlais-next').onclick = orlaisNext
        document.getElementById('orlais-prev').onclick = orlaisPrev
        // on move prev and next
        window.ontouchend = orlaisActivateNextOrPrev
        window.onmouseup = orlaisActivateNextOrPrev

        // add drag img event
        LIGHTBOX.onmousemove = orlaisDragImg
        LIGHTBOX.ontouchmove = orlaisDragImg

        // check click of mouse to deny function close on mouse move
        LIGHTBOX.addEventListener('mouseup', e => {
            if (isMove === false && e.target.id == 'orlais') {
                orlaisClose()
            }
        })

        function orlaisCreate() {
            let lightbox = document.createElement('div')
            lightbox.setAttribute('id', 'orlais')

            let nextButton = document.createElement('div')
            nextButton.setAttribute('id', 'orlais-next')
            nextButton.append('>')

            let prevButton = document.createElement('div')
            prevButton.setAttribute('id', 'orlais-prev')
            prevButton.append('<')

            let imgWrapper = document.createElement('div')
            imgWrapper.setAttribute('id', 'orlaisImgWrapper')

            lightbox.appendChild(nextButton)
            lightbox.appendChild(prevButton)
            lightbox.appendChild(imgWrapper)

            document.body.appendChild(lightbox)
        }

        function orlaisOpen() {
            // remove all images of lightbox
            let imgs = LIGHTBOX.querySelectorAll('img')
            for (img of imgs) {
                IMGWRAPPER.removeChild(img)
            }

            const TARGET = window.event.target
            LIGHTBOX.classList.add('orlais-in')
            LIGHTBOX.classList.remove('orlais-out')
            document.body.style.overflow = "hidden";

            currentWrapper = TARGET.closest(".orlais-wrapper")
            currentImage = TARGET.cloneNode(false)
            // to firefox fix
            currentImage.setAttribute('ondragstart', 'return false')

            IMGWRAPPER.appendChild(currentImage)
        }

        function orlaisClose() {
            LIGHTBOX.classList.add('orlais-out')
            LIGHTBOX.classList.remove('orlais-in')
            document.body.style.overflow = "auto";

            // remove all images of lightbox
            let imgs = LIGHTBOX.querySelectorAll('img')
            for (img of imgs) {
                IMGWRAPPER.removeChild(img)
            }
        }

        function orlaisNext() {
            let nextWrapper, nextImg

            if (currentWrapper.nextElementSibling != null) {
                nextWrapper = currentWrapper.nextElementSibling
                nextImg = nextWrapper.querySelector('img')
            } else {
                nextWrapper = currentWrapper.parentElement.firstElementChild
                nextImg = nextWrapper.querySelector('img')
            }

            currentImage = nextImg
            currentWrapper = nextWrapper

            nextImg = nextImg.cloneNode(false)
            nextImg.classList.add('orlais-next-img')
            // to firefox fix
            nextImg.setAttribute('ondragstart', 'return false')

            LIGHTBOX.querySelector('img').remove()
            IMGWRAPPER.appendChild(nextImg)
            IMGWRAPPER.style.transform = 'translateX(0px)'
        }

        function orlaisPrev() {
            let prevWrapper, prevImg
            
            console.log(currentWrapper);
            if (currentWrapper.previousElementSibling != null) {
                prevWrapper = currentWrapper.previousElementSibling
                prevImg = prevWrapper.querySelector('img')
            } else {
                prevWrapper = currentWrapper.parentElement.lastElementChild
                prevImg = prevWrapper.querySelector('img')
            }

            currentImage = prevImg
            currentWrapper = prevWrapper

            prevImg = prevImg.cloneNode(false)
            prevImg.classList.add('orlais-prev-img')
            // to firefox fix
            prevImg.setAttribute('ondragstart', 'return false')

            LIGHTBOX.querySelector('img').remove()
            IMGWRAPPER.appendChild(prevImg)
            IMGWRAPPER.style.transform = 'translateX(0px)'
        }

        function orlaisOnDbClick(callback) {
            if (touchtime == 0) {
                // set first click
                touchtime = new Date().getTime();
            } else {
                // compare first click to this click and see if they occurred within double click threshold
                if (((new Date().getTime()) - touchtime) < 550) {
                    // double click occurred
                    callback()
                    touchtime = 0;
                } else {
                    // not a double click so set as a new first click
                    touchtime = new Date().getTime();
                }
            }
        }

        function orlaisDragImg() {
            let event = window.event
            let x
            typeof event.touches != 'undefined' ? x = event.touches[0].clientX : x = event.clientX

            let calc = x - startClickX

            if (isClick == true) {
                IMGWRAPPER.style.transform = `translateX(${calc}px)`
            }
        }

        function orlaisActivateNextOrPrev() {
            if ((startClickX - currentClickX) >= 75) {
                orlaisNext()
            } else if ((startClickX - currentClickX) <= -75) {
                orlaisPrev()
            }
            isClick = false
        }

    }

    orlais()

})


