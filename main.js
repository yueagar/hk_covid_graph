((e, $, o) => {
    const drawer = new class {
        constructor() {
            this.author = "YueAgar_c",
            this.version = "1.0.0",
            this.type = "graph",
            this.canvas = o.getElementById("canvas"),
            this.ready()
        }
        ready() {
            alert("Instructions:\n1. Scroll down to zoom out.\n2. Scroll up to zoom in.\n3. Drag to move."),
            this.renderer = new PIXI.Renderer({
                view: this.canvas,
                width: e.innerWidth,
                height: e.innerHeight,
                resolution: e.devicePixelRatio,
                backgroundColor: 0xffffff,
                autoDensity: !0,
                antialias: !0
            }),
            e.onresize = () => {
                this.canvas.width = 0 | e.innerWidth,
                this.canvas.height = 0 | e.innerHeight,
                this.center.x = this.canvas.width/2,
                this.center.y = this.canvas.height/2,
                this.renderer.resize(this.canvas.width, this.canvas.height)
            },
			this.month = [2, "February"],
			//this.month = [3, "March"],
			this.wave = "4th",
			//this.wave = "5th",
            //this.cases = [1, 0, 0, 0, 2, 1, 9, 19, 34, 32, 16, 30, 41, 40, 14, 63, 50, 60, 83, 66, 58, 105, 111, 115, 126, 103, 142, 98, 113, 145, 118], //July 3rd wave
            //this.cases = [124, 115, 80, 75, 82, 91, 81, 67, 63, 67, 32, 61, 65, 46, 39, 74, 31, 35, 23, 18, 18, 24, 19, 7, 16, 24, 18, 16, 10, 10, 7], //August 3rd wave
            //this.cases = [9, 8, 8, 7, 7, 15, 10, 3, 5, 5, 3, 9, 11, 12, 0, 5, 6, 2, 4, 4, 2, 3, 2, 3, 2, 0, 1, 3, 0, 1], //September 3rd wave, X+Y: X-非全民檢測，Y-全民檢測
            //this.cases = [1, 3, 1, 2, 4, 5, 9, 14, 7, 3, 4, 4, 4, 0, 4, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0], //October 3rd wave
            //this.cases = [1, 4, 3, 2, 1, 0, 1, 3, 0, 2, 3, 7, 4, 3, 5, 0, 1, 3, 4, 21, 36, 61, 63, 69, 84, 75, 89, 81, 109, 68], //November 4th wave
            //this.cases = [72, 97, 79, 100, 92, 87, 71, 95, 99, 102, 81, 64, 92, 77, 89, 79, 90, 64, 102, 70, 78, 53, 47, 61, 50, 53, 69, 60, 50, 47, 62], //December 4th wave
            //this.cases = [36, 34, 40, 43, 31, 22, 29, 42, 53, 28, 38, 60, 42, 26, 35, 49, 51, 102, 55, 77, 63, 55, 78, 72, 69, 63, 57, 38, 48, 26, 44], //January 4th wave
            this.cases = [29, 24, 19, 19, 34, 16, 24, 28, 21, 17, 17, 18, 10, 10, 4, 6, 12, 8, 12, 10, 19, 13, 11, 16, 12, 18, 31, 17], //February 4th wave
            //this.cases = [11, 7, 14, 6, 8, 4, 13, 6, 8, 6, 19, 54, 43, 24], //March
            this.lastUpdateTime = "2021.3.1 17:23"
            //this.lastUpdateTime = "2021.3.13 17:47"
            this.nodes = [];
            for (let i=0; i<this.cases.length; i++) {
                this.nodes.push(this.addNode(i+1, this.cases[i]))
            };
            this.texts = new Map(),
            //this.scrolling = !1,
            this.totalCases = this.cases.reduce((a,b)=>a+b),
            this.xScale = Math.ceil(this.cases.length/20),
            this.maxYScale = Math.ceil(this.cases.sort((a, b) => { return b - a })[0]/5/10)*10,
            this.maxYLength = Math.ceil(this.cases.sort((a, b) => { return b - a })[0]/this.maxYScale),
            this.dragged = !1,
            this.scale = 1,
            this.viewport = 1,
            this.mouse = {
                x: 0,
                y: 0
            },
            this.moved = {
                x: 0,
                y: 0
            },
            this.pos = {
                x: 0,
                y: 0
            },
            this.center = {
                x: this.canvas.width/2,
                y: this.canvas.height/2
            },
            this.root = new PIXI.Container(),
            this.stage = new PIXI.Container(),
            this.graphics = new PIXI.Graphics(),
            this.loop = new PIXI.Ticker(),
            this.loop.add(delta => {
                this.draw(delta)
            }),
            this.loop.start(),
            o.body.addEventListener("mousemove", event => {
                (this.dragged/* || this.scrolling*/) && (this.moved.x = this.mouse.x - event.clientX,
                this.moved.y = this.mouse.y - event.clientY)
            }),
            o.body.addEventListener("mousedown", event => {
                event.button === 0 ? (document.body.style.cursor = "move",
                this.dragged = !0,
                this.mouse.x = event.clientX,
                this.mouse.y = event.clientY) : event.button === 1/* || event.button === 2*/ && (this.pos.x = 0,
                this.pos.y = 0,
                this.moved.x = 0,
                this.moved.y = 0,
                this.scale = 1)
            }),
            o.body.addEventListener("mouseup", event => {
                document.body.style.cursor = "auto",
                this.dragged = !1,
                this.pos.x -= this.moved.x/this.viewport,
                this.pos.y -= this.moved.y/this.viewport,
                this.moved.x = 0,
                this.moved.y = 0
            }),
            o.body.addEventListener("keydown", event => {
                switch (event.keyCode) {
                    case 37: // left
                        this.pos.x -= 1/this.viewport;
                        break;
                    case 38: // up
                        this.pos.y -= 1/this.viewport;
                        break;
                    case 39: // right
                        this.pos.x += 1/this.viewport;
                        break;
                    case 40: // down
                        this.pos.y += 1/this.viewport;
                        break;
                    default:
                        break;
                }
            }),
            o.body.addEventListener("contextmenu", event => {
                //event.preventDefault()
            }),
            this.canvas.addEventListener("wheel", event => {
                //this.scrolling = !0,
                this.mouse.x = event.clientX,
                this.mouse.y = event.clientY,
                0 > event.wheelDelta && this.scale > 0.1 ? this.scale *= 88 / 100 : 0 < event.wheelDelta && this.scale < 5 ? this.scale /= 88 / 100 : this.scale/*,
                this.isScrolling !== undefined && clearTimeout(this.isScrolling),
                this.isScrolling = setTimeout(() => {
                    this.scrolling = !1
                }, 100)*/
            })
        }
        addNode(day, cases) {
            return {
                "day": day,
                "cases": cases
            }
        }
        getText(id) {
            let e;
            return this.texts.get(id) || (e = new PIXI.Text(), this.texts.set(id, e), e);
        }
        draw(delta) {
            const stats = this.getText("stats");
            //stats.text = `Moved X: ${this.moved.x}\nMoved Y: ${this.moved.y}`;
            stats.position.set(this.center.y/5, this.center.y/5),
            this.viewport += (this.scale - this.viewport) / 8,
            this.stage.removeChildren(),
            this.graphics.clear(),
            this.graphics.beginFill(0, 0),
            this.graphics.lineStyle(3, 0x000000);
            //title
            const title = this.getText("title");
            title.text = `Daily local new cases of coronavirus in HKSAR in ${this.month[1]} ${this.wave ? ("(" + this.wave + " wave)") : ""}`,
            title.position.set((this.center.y/5+100/this.xScale+(this.nodes.length+1)*100/this.xScale-title.width)/2, this.center.y/5);
            //y axis
            const yT = this.getText("yT");
            yT.text = "No. of new\nlocal cases",
            yT.style.align = "center",
            yT.position.set(this.center.y/5-75, this.center.y/5+stats.height+30),
            this.graphics.moveTo(this.center.y/5, this.center.y/5+stats.height+100),
            this.graphics.lineTo(this.center.y/5, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
            this.graphics.moveTo(this.center.y/5, this.center.y/5+stats.height+100),
            this.graphics.lineTo(this.center.y/5-15, this.center.y/5+stats.height+100+30),
            this.graphics.moveTo(this.center.y/5, this.center.y/5+stats.height+100),
            this.graphics.lineTo(this.center.y/5+15, this.center.y/5+stats.height+100+30);
            for (let i=-1; i<this.maxYLength; i++) {
                this.graphics.moveTo(this.center.y/5-15, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-(i+1)*100),
                this.graphics.lineTo(this.center.y/5, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-(i+1)*100);
                const text = this.getText((i+1) * this.maxYScale);
                text.text = (i+1) * this.maxYScale,
                text.position.set(this.center.y/5-45-text.text.length*10, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-(i+1)*100-15),
                this.stage.addChild(text);
            };
            //x axis
            const xT = this.getText("xT");
            xT.text = "Day",
            xT.position.set(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale+15, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-15),
            this.graphics.moveTo(this.center.y/5, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
            this.graphics.lineTo(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
            this.graphics.moveTo(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
            this.graphics.lineTo(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale-30, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-15),
            this.graphics.moveTo(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
            this.graphics.lineTo(this.center.y/5+100+(this.nodes.length+1)*100/this.xScale-30, this.center.y/5+stats.height+100+(this.maxYLength+1)*100+15);
            for (let i=0; i<this.nodes.length; i++) {
                this.graphics.moveTo(this.center.y/5+100/this.xScale+(i+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100),
                this.graphics.lineTo(this.center.y/5+100/this.xScale+(i+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100+15);
                const text = this.getText(`day${i+1}`);
                text.text = `${this.month[0]}.${i+1}`,
                text.anchor.set(.5, .5),
                text.rotation = -60/360 * 2 * Math.PI,
                text.position.set(this.center.y/5+100/this.xScale+(i+1)*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100+text.width*4/text.text.length);
                /*const text2 = this.getText(`d${i+1}c`);
                text2.text = `(+${this.nodes[i].cases})`,
                text2.position.set(this.center.y/5+(i+1)*100-20-(text.text.length-3)*5, this.center.y/5+stats.height+135+(this.maxYLength+1)*100+15),*/
                this.stage.addChild(text/*, text2*/)
            };
            this.graphics.endFill(),
            //nodes
            this.graphics.beginFill(0x000000, 1),
            this.graphics.lineStyle(0);
            for (let i=0; i<this.nodes.length; i++) {
                this.graphics.drawCircle(this.center.y/5+100/this.xScale+this.nodes[i].day*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-this.nodes[i].cases/this.maxYScale*100, 10);
                const text = this.getText(`d${i+1}c2`);
                text.text = `${this.nodes[i].cases}`,
                text.style.fontSize = "20px",
                text.position.set(this.center.y/5+100/this.xScale+this.nodes[i].day*100/this.xScale-text.text.length*6, this.center.y/5+stats.height+60+(this.maxYLength+1)*100-this.nodes[i].cases/this.maxYScale*100),
                this.stage.addChild(text);
            };
            this.graphics.endFill(),
            //connecting lines
            this.graphics.beginFill(0),
            this.graphics.lineStyle(5, 0x000000),
            //this.graphics.moveTo(this.center.y/5, this.center.y/5+stats.height+100+(this.maxYLength+1)*100)
            this.graphics.moveTo(this.center.y/5+100, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-this.nodes[0].cases/this.maxYScale*100)
            for (let i=0; i<this.nodes.length; i++) {
                this.graphics.lineTo(this.center.y/5+100/this.xScale+this.nodes[i].day*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-this.nodes[i].cases/this.maxYScale*100, 10),
                this.graphics.moveTo(this.center.y/5+100/this.xScale+this.nodes[i].day*100/this.xScale, this.center.y/5+stats.height+100+(this.maxYLength+1)*100-this.nodes[i].cases/this.maxYScale*100)
            };
            this.graphics.endFill();
            //adding stuff
            const end = this.getText("end");
            end.text = `\nTotal new local cases in ${this.month[1]}: ${this.totalCases}\n\nSource of data: Department of Health\nLast update: ${this.lastUpdateTime} GMT +8`,
            end.position.set((this.center.y/5+100/this.xScale+(this.nodes.length+1)*100/this.xScale-end.width)/2, this.center.y/5+stats.height+220+(this.maxYLength+1)*100),
            end.style.align = "center";
            const ps = this.getText("ps");
            ps.text = `*P.S. Only confirmed cases are counted, i.e. preliminary confirmed cases and suspected cases are not counted.`,
            ps.position.set(this.center.y/5, this.center.y/5+stats.height+200+(this.maxYLength+1)*100),
            ps.style.fontSize = "15px",
            this.stage.addChild(this.graphics, stats, title, xT, yT, end, ps),
            this.stage.position.set(this.pos.x-this.moved.x/this.viewport, this.pos.y-this.moved.y/this.viewport),
            this.root.addChild(this.stage),
            this.root.pivot.set(this.center.x, this.center.y),
            this.root.scale.set(this.viewport, this.viewport),
            this.root.position.set(this.center.x, this.center.y),
            this.renderer.render(this.root)
        }
    }
    e.drawer = drawer;
})(window, $, document);