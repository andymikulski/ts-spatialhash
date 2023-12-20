// Assuming SpatialHash class is already defined above
// Here's a basic setup for the canvas

import SeededRandom from "./SeededRandom";
import SpatialHash from "./SpatialHash";

const rnd = new SeededRandom(12311231233123133);

const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d')!;
const cellWidth = 75;
const cellHeight = 5;

const hash = new SpatialHash(cellWidth, cellHeight);

// Function to draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const smallGridSize = 10;
  for (let x = 0; x < canvas.width; x += smallGridSize) {
    for (let y = 0; y < canvas.height; y += smallGridSize) {
      ctx.strokeStyle = '#ddd';
      ctx.strokeRect(x, y, smallGridSize, smallGridSize);
    }
  }

  for (let x = 0; x < canvas.width; x += cellWidth) {
    for (let y = 0; y < canvas.height; y += cellHeight) {
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x, y, cellWidth, cellHeight);

      const ents = hash.query(x, y, cellWidth, cellHeight);
      if (ents.length) {
        ctx.fillStyle = 'rgba(0,0,100,' + ents.length * 0.1 + ')';
        ctx.fillRect(x, y, cellWidth, cellHeight);
      }
    }
  }
}

// Function to add a random entity and draw it
function addRandomEntity() {
  const x = rnd.random() * canvas.width;
  const y = rnd.random() * canvas.height;
  const entity = { x, y }; // Simple entity with x, y properties

  hash.insert(entity, x, y, 10, 10);
  return entity;
}

// Function to draw an entity
function drawEntity(entity: { x: number, y: number }) {
  ctx.fillStyle = 'red';
  // draw a rect at the entity's position
  ctx.fillRect(entity.x, entity.y, 10, 10);
}

// Adding a few random entities
let ents: { x: number; y: number; }[] = [];
for (let i = 0; i < 25; i++) {
  ents.push(addRandomEntity());
}



// Initial setup
drawGrid();


let now = Date.now();
let last = now;
let delta = 0;
let time = 0;
let i = 0;
const update = () => {
  now = Date.now();
  delta = (now - last) / 1000;
  time += delta;
  last = now;
  drawGrid();

  i = 0;
  for (const ent of ents) {
    i++;
    ent.x += Math.cos(time + i) * delta * 10;
    ent.y += Math.sin(time + i) * delta * 10;
    hash.update(ent, ent.x, ent.y, 10, 10);
    drawEntity(ent);
  }

  requestAnimationFrame(update);
}

update();
