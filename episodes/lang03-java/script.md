# Languages 03: Java

Series: "How languages actually work" (under 60 s). Look and props: engine/series-languages.js.
Facts: James Gosling's team at Sun Microsystems, released 1995, first called Oak. Minecraft (Java
Edition) is written in Java; Android apps were written in Java for years (Kotlin is preferred now).
javac -> bytecode (.class) -> JVM; HotSpot JIT compiles hot methods; garbage collection.

## Voice-over

Minecraft was written in this language. So were early Android apps.
It's Java. Born in 1995 at Sun Microsystems. It was first called Oak.
The promise: write once, run anywhere.
Java doesn't compile to machine code. It compiles to bytecode: instructions for a computer that doesn't exist.
That computer is the Java Virtual Machine. Every device gets its own, and the same bytecode runs on all of them.
Slow? Not anymore. The JVM watches which code runs most, and compiles that part to machine code while it runs.
And you never free memory yourself. A garbage collector cleans up what you stopped using.
That's why banks, Android and huge backends trust it.
Next: C sharp. Microsoft's answer to Java.
