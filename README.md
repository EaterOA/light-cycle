# Light Cycle
=======

## Description

Our project is an implementation of the Tron game, also known
as Light Cycle. Moving bikes are placed in a cubic arena, where
they are free to move around. As each bike moves, a wall extends from
the back of the bike, which covers the path that the bike travels.
Any collision with a wall removes the bike and its corresponding walls
from the arena. The bike is free to move along the arena cube as long
as it doesn't collide with a wall.

To start the game, run the index.html file in a web browser. It should
open up the game in the window and begin moving the bike. The game gives
control of the blue bike with a number of controls.

## Movement:

* W - speed up (maximum double default speed)
* A - turn left (relative to current direction)
* S - slow down (minimum half default speed)
* D - turn right (relative to current direction)
* Space - jump

While jumping, you will not be able to turn nor speed up / slow down.

## Camera:

The camera starts from a third-person-perspective view anchored to the bike.
The controls for it are as follows:

* Left arrow - rotate camera left around bike
* Right arrow - rotate camera right around bike
* Up arrow - tilt camera upwards

You can toggle to free-camera mode and back by pressing the "`" (grave) key.
The controls in free-camera mode are:

* A - strafe left
* D - strafe right
* W - move forward
* S - move backward
* Up arrow - move upwards
* Down arrow - move downwards
* Left arrow - rotate left
* Right arrow - rotate right
* Z - rotate upwards
* X - rotate downwards

## Miscellaneous:

* Esc - pauses/unpauses the game. No movement or camera control is
  allowed while the game is paused and the screen darkens to indicate this.
* Enter - starts/restarts the game
* M - enables/disables the bgm and collision sounds (if those resources are
  present)

## Details:

There are two main aspects of the world: the arena and the camera. The
arena is a 500x500x500 cube which stores all of the bikes and walls.
The camera follows the player for the most part unless it is detached
into free mode.

Bikes are first initialized individually by the world, which adds it into
its array of objects. Every bike is also associated with its own wall,
uniquely identified by its bike. As the bike changes direction, it detaches
the current wall, pushes it into the list of world objects, and creates a
new one to grow.

Each bike and wall has its own color, consisting of lighting as well. The
arena's walls and floor consist of a repeated texture. When the game is
paused, both the lighting and texture are darkened.

To create the bike image, we used the image loader found at
https://github.com/frenchtoast747/webgl-obj-loader. It processes an image
in .obj file form and generates the vertices that creates it.

Collision detection is done through the nearestWalls function, which checks
all walls to see if a bike is between the two endpoints of any of them.
If so, it is considered a collision, and the bike and its walls are
subsequently removed from the arena.
