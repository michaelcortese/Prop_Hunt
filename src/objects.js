import * as T from '../CS559-Three/build/three.module.js';
import { HingedDoor } from './interactive.js';



export function createHouse(w, h, d, t, floorMat, wallMat, frameMat, doorMat, handleMat, windowMat) {
    const doorW = 1.5;
    const doorH = Math.min(h, 2.5);
    
    // Create Groups
    const house = new T.Group();
    let groundObjs = [];
    let obstacles = [];
    let interactables = [];

    // Create Floor and ceiling
    const floor = createFloor(w, d, 0.01, floorMat);
    const ceil = createFloor(w, d, h, floorMat);
    house.add(floor);
    house.add(ceil);
    groundObjs.push(floor);
    obstacles.push(floor);

    // Create all walls except front
    const backWall = createWall(0, h/2, -d/2, w, h, t, wallMat);
    const leftWall = createWall(-w/2, h/2, 0, t, h, d, wallMat);
    const rightWall = createWall(w/2, h/2, 0, t, h, d, wallMat);
    house.add(backWall);
    house.add(leftWall);
    house.add(rightWall);
    obstacles.push(backWall);
    obstacles.push(leftWall);
    obstacles.push(rightWall);

    // const exterior = createHouseExterior(w, h, d, T, floorMat, wallMat, frameMat, doorMat, handleMat, windowMat);
    // house.add(exterior.group);
    // exterior.groundObjs.forEach(obj => groundObjs.push(obj));
    // exterior.obstacles.forEach(obj => obstacles.push(obj));
    // exterior.interactables.forEach(obj => interactables.push(obj));

    // Create Front door, wall, and windows
    const frontDoor = createDoor(
        0, doorH/2 , d/2, doorW, doorH, t, frameMat, doorMat, handleMat, 0
    );
    const frontDoorWall = createWall(0, (h+doorH)/2, d/2, doorW, (h-doorH), t, wallMat);
    const frontLeftWall = createWallWithWindow(
       (w+doorW)/4, h/2, d/2, (w-doorW)/2, h, t, 
        1.5, 0.5, 1.2, 1,
        wallMat, frameMat, windowMat, Math.PI 
    );
    const frontRightWall = createWallWithWindow(
        -(w+doorW)/4, h/2, d/2, (w-doorW)/2, h, t, 
        -1.5, 0.5, 1.2, 1,
        wallMat, frameMat, windowMat, Math.PI 
    );
    house.add(frontDoor.frame);
    house.add(frontDoorWall);
    house.add(frontLeftWall);
    house.add(frontRightWall);
    //obstacles.push(frontDoor.frame);
    obstacles.push(frontLeftWall);
    obstacles.push(frontRightWall);
    obstacles.push(frontDoorWall);

    // Create Bedroom walls with doors into the rooms
    const bedroomHallwayWall1 = createWallWithPassage(
        -2, h/2, 6, 8, h, t,
        0, doorW, doorH,
        wallMat, -Math.PI/2
    );
    const bedroomDoor1 = new HingedDoor({
        x:-2, y:doorH/2, z:6, width:doorW, height:doorH, depth:t,
        frameMat:frameMat, doorMat:doorMat, handleMat:handleMat, rotationY:-Math.PI/2
    });
    house.add(bedroomHallwayWall1);
    house.add(bedroomDoor1);
    obstacles.push(bedroomHallwayWall1);
    obstacles.push(bedroomDoor1);
    interactables.push(bedroomDoor1);

    const bedroomHallwayWall2 = createWallWithPassage(
        -2, h/2, -2, 8, h, t,
        -2, doorW, doorH,
        wallMat, Math.PI/2
    );
    const bedroomDoor2 = new HingedDoor({
        x:-2, y:doorH/2, z:0, width:doorW, height:doorH, depth:t, frameMat:frameMat,
        doorMat:doorMat, handleMat:handleMat, rotationY:-Math.PI/2
    });
    house.add(bedroomHallwayWall2);
    house.add(bedroomDoor2);
    obstacles.push(bedroomHallwayWall2);
    obstacles.push(bedroomDoor2);
    interactables.push(bedroomDoor2);

    const bedroomHallwayWall3 = createWallWithPassage(
        -2, h/2, -8, 4, h, t,
        0, doorW, doorH,
        wallMat, Math.PI/2
    );
    const bedroomDoor3 = new HingedDoor({
        x:-2, y:doorH/2, z:-8, width:doorW, height:doorH, depth:t, frameMat:frameMat,
        doorMat:doorMat, handleMat:handleMat, rotationY:-Math.PI/2
    });
    house.add(bedroomHallwayWall3);
    house.add(bedroomDoor3);
    obstacles.push(bedroomHallwayWall3);
    obstacles.push(bedroomDoor3);
    interactables.push(bedroomDoor3);

    // Create walls seperating the bedrooms
    const bedroomSeperateWall1 = createWall(-6, h/2, 2, 8, h, t, wallMat);
    const bedroomSeperateWall2 = createWall(-6, h/2, -5, 8, h, t, wallMat);
    house.add(bedroomSeperateWall1);
    house.add(bedroomSeperateWall2);
    obstacles.push(bedroomSeperateWall1);
    obstacles.push(bedroomSeperateWall2);




    const kitchenHallWall = createWallWithPassage(
        5, h/2, 7, 6, h, t, 0, doorW, doorH, wallMat, Math.PI/2
    );
    const kitchenDiningWall = createWallWithPassage(
        7.5, h/2, 4, 5+t, h, t, 0, doorW, doorH, wallMat, 0
    );
    house.add(kitchenHallWall);
    house.add(kitchenDiningWall);
    obstacles.push(kitchenHallWall);
    obstacles.push(kitchenDiningWall);

    
    // Create Door to the basement
    const basementDoor = createDoor(
        0, doorH/2, -d/2 - t/2, doorW, doorH, t, frameMat, doorMat
    );
    house.add(basementDoor.frame);
    obstacles.push(basementDoor.door, basementDoor.frameLeft, basementDoor.frameTop, basementDoor.frameRight);

    return {house, groundObjs, obstacles, interactables};
}

export function createHouseExterior(w, h, d, t, floorMat, wallMat, frameMat, doorMat, handleMat, windowMat) {
    const doorW = 1.5;
    const doorH = Math.min(h, 2.5);
    
    // Create Groups
    const group = new T.Group();
    let groundObjs = [];
    let obstacles = [];
    let interactables = [];

    // Create Floor and ceiling
    const floor = createFloor(w, d, 0.01, floorMat);
    const ceil = createFloor(w, d, h, floorMat);
    group.add(floor);
    group.add(ceil);
    groundObjs.push(floor);
    obstacles.push(floor);

    // Create front Wall With Windows
    const frontWall1 = createWallWithWindow(
        -7, h/2, d/2, 6, h, t, 
        -1.5, 0.5, 1.2, 1,
        wallMat, frameMat, windowMat, Math.PI 
    );
    const frontWall2 = createWallWithWindow(
       -2, h/2, d/2, 4, h, t, 
        1.5, 0.5, 1.2, 1,
        wallMat, frameMat, windowMat, Math.PI 
    );
    const frontWall3 = createWallWithPassage(
        4, h/2, d/2, 4, h, t, 
        -2+doorW, doorW, doorH, wallMat
    );
    const frontDoor = createDoor(
        2, doorH/2, d/2, doorW, doorH, t, 
        frameMat, doorMat, handleMat
    );
    const frontWall4 = createWallWithWindow(
        8, h/2, d/2, 4, h, t, 
        -1.5, 0.5, 1.2, 1,
        wallMat, frameMat, windowMat, Math.PI 
    );
    group.add(frontWall1);
    group.add(frontWall2);
    group.add(frontWall3);
    group.add(frontDoor);
    group.add(frontWall4);
    obstacles.push(frontWall1);
    obstacles.push(frontWall2);
    obstacles.push(frontWall3);
    obstacles.push(frontDoor);
    obstacles.push(frontWall4);

    return { group, groundObjs, obstacles, interactables };
}


// Helper functions building complex objects with simple objects

// Creates a wall with a window in it
export function createWallWithWindow(
    x, y, z, w, h, t,
    winOffsetX, winOffsetY, winW, winH,
    wallMat, frameMat, glassMat,
    rotationY = 0
) {
    const group = new T.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotationY;

    // Window bounds relative to wall center
    const winBottom = winOffsetY - winH/2;
    const winTop    = winOffsetY + winH/2;
    const winLeft   = winOffsetX - winW/2;
    const winRight  = winOffsetX + winW/2;

    // --- Top wall segment ---
    const topHeight = h/2 - winTop;
    if (topHeight > 0) {
        const topWall = new T.Mesh(new T.BoxGeometry(w, topHeight, t), wallMat);
        topWall.position.set(0, winTop + topHeight/2, 0);
        group.add(topWall);
    }

    // --- Bottom wall segment ---
    const bottomHeight = winBottom - (-h/2);
    if (bottomHeight > 0) {
        const bottomWall = new T.Mesh(new T.BoxGeometry(w, bottomHeight, t), wallMat);
        bottomWall.position.set(0, -h/2 + bottomHeight/2, 0);
        group.add(bottomWall);
    }

    // --- Left wall segment ---
    const leftWidth = winLeft - (-w/2);
    if (leftWidth > 0) {
        const leftWall = new T.Mesh(new T.BoxGeometry(leftWidth, winH, t), wallMat);
        leftWall.position.set(-w/2 + leftWidth/2, winOffsetY, 0);
        group.add(leftWall);
    }

    // --- Right wall segment ---
    const rightWidth = w/2 - winRight;
    if (rightWidth > 0) {
        const rightWall = new T.Mesh(new T.BoxGeometry(rightWidth, winH, t), wallMat);
        rightWall.position.set(w/2 - rightWidth/2, winOffsetY, 0);
        group.add(rightWall);
    }

    // --- Window itself ---
    const window = createWindow(winOffsetX, winOffsetY, 0, winW, winH, t, frameMat, glassMat);
    group.add(window.window);

    return group;
}

// Creates a wall with a doorway hole in it
export function createWallWithPassage(
    x, y, z, w, h, t,
    passageOffsetX, passageW, passageH,
    wallMat,
    rotationY = 0
) {
    const group = new T.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotationY;

    // Passage bounds relative to wall center
    const passLeft  = passageOffsetX - passageW/2;
    const passRight = passageOffsetX + passageW/2;
    const passTop   = passageH;

    // --- Left wall segment ---
    const leftWidth = passLeft - (-w/2);
    if (leftWidth > 0) {
        const leftWall = new T.Mesh(new T.BoxGeometry(leftWidth, h, t), wallMat);
        leftWall.position.set(-w/2 + leftWidth/2, 0, 0);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        group.add(leftWall);
    }

    // --- Right wall segment ---
    const rightWidth = w/2 - passRight;
    if (rightWidth > 0) {
        const rightWall = new T.Mesh(new T.BoxGeometry(rightWidth, h, t), wallMat);
        rightWall.position.set(w/2 - rightWidth/2, 0, 0);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        group.add(rightWall);
    }

    // --- Top wall segment (above passage) ---
    const topHeight = h - passageH;
    if (topHeight > 0) {
        const topWall = new T.Mesh(new T.BoxGeometry(passageW, topHeight, t), wallMat);
        topWall.position.set(passageOffsetX, passageH + topHeight/2 - h/2, 0);
        topWall.castShadow = true;
        topWall.receiveShadow = true;
        group.add(topWall);
    }

    return group;
}






// Helper function Creating Simple Objects

// Creates a basic wall
export function createWall(x, y, z, w, h, d, mat) {
    const wall = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
    wall.position.set(x, y, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    
    return wall;
};

// Creates a horizontal plane
export function createFloor(w, d, h, mat) {
    // Floor (interior)
    const floor = new T.Mesh(new T.PlaneGeometry(w, d), mat);

    floor.position.set(0, h, 0);

    floor.rotation.x = -Math.PI/2;
    floor.material.side = T.DoubleSide; // Render both sides
    floor.receiveShadow = true;

    return floor;
}

// Creates a Door with a frame and handle
export function createDoor(x, y, z, w, h, t, frameMat, doorMat, handleMat, rotationY) {
    // Create the Frame of the door
    const frame = new T.Group();
    frame.position.set(x, y, z);
    frame.rotation.y = rotationY;
    

    const frameTop = new T.Mesh(new T.BoxGeometry(w, t, t), frameMat);
    frameTop.position.set(0, (h-t)/2, 0);
    frameTop.castShadow = true;
    frameTop.receiveShadow = true;
    frame.add(frameTop);

    const frameLeft = new T.Mesh(new T.BoxGeometry(t, h, t), frameMat);
    frameLeft.position.set((-w + t)/2, 0, 0);
    frameLeft.castShadow = true;
    frameLeft.receiveShadow = true;
    frame.add(frameLeft);

    const frameRight = new T.Mesh(new T.BoxGeometry(t, h, t), frameMat);
    frameRight.position.set((w - t)/2, 0, 0);
    frameRight.castShadow = true;
    frameRight.receiveShadow = true;
    frame.add(frameRight);

    // Create the door for the frame
    const hing = new T.Object3D();
    const door = new T.Mesh(new T.BoxGeometry(w - 2*t, h-t, t), doorMat);
    hing.position.set(-(w-t)/2, 0, 0);
    door.position.set((w-t)/2, -t/2, 0);
    door.castShadow = true;
    door.receiveShadow = true;
    hing.add(door);
    frame.add(hing);

    // Create a handle for each side of the door
    const frontHandle = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.15, 16), handleMat);
    frontHandle.rotation.x = Math.PI / 2; // Lay it horizontally
    frontHandle.position.set(3*w/4, 0, t/2);
    hing.add(frontHandle);

    const backHandle = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.15, 16), handleMat);
    backHandle.rotation.x = -Math.PI / 2; // Lay it horizontally
    backHandle.position.set(3*w/4, 0, -t/2);
    hing.add(backHandle);

    return { frame, door, frameLeft, frameTop, frameRight, hing };
}

// Creates a window with a frame
export function createWindow(x, y, z, w, h, t, frameMat, glassMat, rotationY=0) {
    const window = new T.Group();
    window.position.set(x, y, z);
    window.rotation.y = rotationY;

    // Window frame
    const frameTop = new T.Mesh(new T.BoxGeometry(w-t, t, t), frameMat);
    frameTop.position.set(0, (h-t)/2, 0);
    frameTop.castShadow = true;
    frameTop.receiveShadow = true;
    window.add(frameTop);

    const frameBottom = new T.Mesh(new T.BoxGeometry(w-t, t, t), frameMat);
    frameBottom.position.set(0, (-h+t)/2, 0);
    frameBottom.castShadow = true;
    frameBottom.receiveShadow = true;
    window.add(frameBottom);

    const frameLeft = new T.Mesh(new T.BoxGeometry(t, h, t), frameMat);
    frameLeft.position.set((-w+t)/2, 0, 0);
    frameLeft.castShadow = true;
    frameLeft.receiveShadow = true;
    window.add(frameLeft);

    const frameRight = new T.Mesh(new T.BoxGeometry(t, h, t), frameMat);
    frameRight.position.set((w-t)/2, 0, 0);
    frameRight.castShadow = true;
    frameRight.receiveShadow = true;
    window.add(frameRight);

    // Window glass
    const glass = new T.Mesh(new T.PlaneGeometry(w, h), glassMat);
    glass.position.z = 0.05;
    window.add(glass);

    return {window, frameBottom, frameLeft, frameTop, frameRight, glass };
}

export function createBookshelf(x, y, z, w, h, d, mat) {
    const shelf = new T.Group();
    shelf.position.set(x, y, z);

    const back = new T.Mesh(new T.BoxGeometry(0.1, h, d), mat);
    back.position.set(0, h/2, 0);
    shelf.add(back);

    const shelfCount = 4;
    for (let i = 0; i < shelfCount; i++) {
        const board = new T.Mesh(new T.BoxGeometry(w, 0.05, d), mat);
        board.position.set(0, (i + 1) * (h / (shelfCount + 1)), 0);
        shelf.add(board);
    }

    return shelf;
}

export function createTable(x, y, z, w, h, d, mat) {
    const table = new T.Group();
    table.position.set(x, y, z);

    const top = new T.Mesh(new T.BoxGeometry(w, 0.05, d), mat);
    top.position.set(0, h, 0);
    table.add(top);

    const legGeo = new T.BoxGeometry(0.05, h, 0.05);

    const legPositions = [
        [-w/2 + 0.1, h/2, -d/2 + 0.1],
        [ w/2 - 0.1, h/2, -d/2 + 0.1],
        [-w/2 + 0.1, h/2,  d/2 - 0.1],
        [ w/2 - 0.1, h/2,  d/2 - 0.1],
    ];

    for (const [lx, ly, lz] of legPositions) {
        const leg = new T.Mesh(legGeo, mat);
        leg.position.set(lx, ly, lz);
        table.add(leg);
    }

    return table;
}

export function createCouch(x, y, z, w, h, d, mat) {
    const couch = new T.Group();
    couch.position.set(x, y, z);

    const base = new T.Mesh(new T.BoxGeometry(w, h/2, d), mat);
    base.position.set(0, h/4, 0);
    couch.add(base);

    const back = new T.Mesh(new T.BoxGeometry(w, h/2, 0.1), mat);
    back.position.set(0, h*0.75, -d/2 + 0.05);
    couch.add(back);

    return couch;
}

export function createCabinet(x, y, z, w, h, d, mat) {
    const cab = new T.Group();
    cab.position.set(x, y, z);

    const body = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
    body.position.set(0, h/2, 0);
    cab.add(body);

    return cab;
}



/**
 * The giant eye that peers through windows
 */
export class GiantEye extends T.Group {
  constructor({ texture, houseWindows, scene, getPlayerPos, getPlayerDir }) {
    super();
    this.houseWindows = houseWindows;
    this.scene = scene;
    this.getPlayerPos = getPlayerPos;
    this.getPlayerDir = getPlayerDir;
    this.visibleNow = false;
    this.timer = 0;
    this.nextPeek = this.randomInterval();
    this.peekDuration = CONFIG.eye.visibleDuration;

    const geom = new T.SphereGeometry(0.6, 32, 32);
    const mat = new T.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      shininess: 30,
    });
    this.mesh = new T.Mesh(geom, mat);
    this.add(this.mesh);

    // Start off-scene
    this.position.set(0, 100, 0);
    scene.add(this);
  }

  randomInterval() {
    return CONFIG.eye.intervalMin + Math.random()*(CONFIG.eye.intervalMax - CONFIG.eye.intervalMin);
  }

  chooseWindow() {
    return this.houseWindows[Math.floor(Math.random()*this.houseWindows.length)];
  }

  update(dt, obstacles) {
    this.timer += dt;

    if (!this.visibleNow && this.timer > this.nextPeek) {
      // Start peeking
      this.timer = 0;
      this.visibleNow = true;
      this.windowTarget = this.chooseWindow();

      const lookPos = this.windowTarget.position.clone();
      lookPos.y += 1.1;
      const outward = new T.Vector3(0, 0, -1).applyQuaternion(this.windowTarget.quaternion);
      const eyePos = lookPos.clone().add(outward.multiplyScalar(1.4)); // just outside window
      this.position.copy(eyePos);
      this.mesh.lookAt(lookPos);
    }

    if (this.visibleNow) {
      // Gently sway
      this.rotation.y += dt*0.2;

      // Vision check (lose condition)
      const playerPos = this.getPlayerPos();
      const toPlayer = new T.Vector3().subVectors(playerPos, this.position);
      const dist = toPlayer.length();
      if (dist < CONFIG.eye.sightDistance) {
        const dir = toPlayer.normalize();
        const eyeForward = new T.Vector3(0,0,1).applyQuaternion(this.mesh.quaternion);
        const angle = Math.acos(T.MathUtils.clamp(eyeForward.dot(dir), -1, 1));
        if (angle < CONFIG.eye.fov) {
          // Check line of sight (ray no obstacles)
          const ray = new T.Raycaster(this.position, dir, 0, dist);
          const hits = ray.intersectObjects(obstacles, true);
          const blocked = hits.length > 0;
          if (!blocked) {
            // Player is spotted -> game over
            return 'spotted';
          }
        }
      }

      if (this.timer > this.peekDuration) {
        // End peeking
        this.timer = 0;
        this.visibleNow = false;
        this.nextPeek = this.randomInterval();
        this.position.set(0, 100, 0);
      }
    }
    return null;
  }
}







