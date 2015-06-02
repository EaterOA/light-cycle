Light Cycle

* Vincent Wong
* William Lai
* Eric Du

===

Our project is an implementation of the Tron game, also known
as Light Cycles. Moving bikes are placed in a cubic arena, where 
they are free to move around. As each bike moves, a wall extends from
the back of the bike, which covers the path that the bike travels.
Any collision with a wall removes the bike and its corresponding walls
from the arena. The bike is free to move along the arena cube as long 
as it doesn't collide with a wall.

To start the game, run the lightcycle.html file in a web browser. It should
open up the game in the window and begin moving the bike. The game gives 
control of the blue bike with a number of controls.

=====================
Movement Controls: 

W - speed up (maximum double default speed)
A - turn left (relative to current direction)
S - slow down (minimum half default speed)
D - turn right (relative to current direction)

======================
Camera Controls: 

The camera starts from a third-perspective view anchored to the bike. 
The controls for it are as follows: 

Left arrow - Rotate camera left around bike
Right arrow - Rotate camera right around bike
Up arrow - Tilt camera upwards

It can be switched to a free-camera view which can be moved freely.
In free-camera mode, the controls are as follows:

J - strafe left
L - strafe right

I - move forward
K - move backward
Up arrow - move upwards
Down arrow - move downwards

Left arrow - rotate left
Right arrow - rotate right
Z - rotate upwards
X - rotate downwards

=======================
Miscellaneous Controls:

P - pauses/unpauses the game. No movement or camera control is allowed 
    while the game is paused and the screen darkens to indicate this.

=======================
