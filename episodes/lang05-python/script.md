# Languages 05: Python

Series: "How languages actually work" (under 60 s). Look and props: engine/series-languages.js.
Facts: Guido van Rossum started Python over the Christmas holidays of 1989 (first release 1991), named
after Monty Python's Flying Circus, not the snake. Instagram's backend is one of the largest Django
(Python) deployments. PyTorch / TensorFlow are Python front ends over C/C++/CUDA kernels.
CPython compiles source to bytecode (.pyc) and its interpreter loop runs it; no separate compile step for
the user. Pure-Python loops are typically 10-100x slower than C. Indentation is part of the syntax.

## Voice-over

Instagram's servers, and almost every AI you've used, run on this language.
It's Python. Guido van Rossum started it over Christmas, 1989.
And no, it's not named after the snake. It's named after Monty Python, the comedy show.
Python reads almost like English. No semicolons, no curly braces. The indentation is the code.
You never compile it yourself. Python turns your file into bytecode, and an interpreter runs it, step by step.
The catch: it's slow. Often ten to a hundred times slower than C.
The trick: the heavy lifting in AI happens in libraries written in C and C plus plus. Python just tells them what to do.
Next: JavaScript. The language every browser speaks.
