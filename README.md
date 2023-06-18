# Isotope
Isotope is the reference server implementation for Xenon Chat. It's at this point just a concept and doesn't actually do anything, but you can look at the architecture to see how I think a chat application might be built.

## Goals
Isotope is built with these goals in mind:
* Lightweight: it aims to require minimal resources to run an instance
* Speed: it should have as low latency as possible for all operations
* Simplicity: it should not sacrifice understandability for rapid development or performance. Complexity introduced for performance should be abstracted when possible.

It is **not** built with these goals in mind:
* Scalability: it should not sacrifice simplicity for scalability. Other implementations for large instances can be built when needed.