(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
/**
 * A manager class for all of the AI in a scene.
 * Keeps a list of registered actors and handles AI generation for actors.
 */
class AIManager {
    constructor() {
        this.actors = new Array();
        this.registeredAI = new Map_1.default();
    }
    /**
     * Registers an actor with the AIManager
     * @param actor The actor to register
     */
    registerActor(actor) {
        this.actors.push(actor);
    }
    removeActor(actor) {
        let index = this.actors.indexOf(actor);
        if (index !== -1) {
            this.actors.splice(index, 1);
        }
    }
    /**
     * Registers an AI with the AIManager for use later on
     * @param name The name of the AI to register
     * @param constr The constructor for the AI
     */
    registerAI(name, constr) {
        this.registeredAI.add(name, constr);
    }
    /**
     * Generates an AI instance from its name
     * @param name The name of the AI to add
     * @returns A new AI instance
     */
    generateAI(name) {
        if (this.registeredAI.has(name)) {
            return new (this.registeredAI.get(name))();
        }
        else {
            throw `Cannot create AI with name ${name}, no AI with that name is registered`;
        }
    }
    update(deltaT) {
        // Run the ai for every active actor
        this.actors.forEach(actor => { if (actor.aiActive)
            actor.ai.update(deltaT); });
    }
}
exports.default = AIManager;
},{"../DataTypes/Map":8}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine_1 = __importDefault(require("../DataTypes/State/StateMachine"));
/**
 * A version of a @reference[StateMachine] that is configured to work as an AI controller for a @reference[GameNode]
 */
class StateMachineAI extends StateMachine_1.default {
    // @implemented
    initializeAI(owner, config) { }
    // @implemented
    destroy() {
        // Get rid of our reference to the owner
        delete this.owner;
        this.receiver.destroy();
    }
    // @implemented
    activate(options) { }
}
exports.default = StateMachineAI;
},{"../DataTypes/State/StateMachine":19}],3:[function(require,module,exports){
"use strict";
// @ignorePage
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A placeholder function for No Operation. Does nothing
 */
const NullFunc = () => { };
exports.default = NullFunc;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A linked-list for the edges in a @reference[Graph].
 */
class EdgeNode {
    /**
     * Creates a new EdgeNode
     * @param index The index of the node this edge connects to
     * @param weight The weight of this edge
     */
    constructor(index, weight) {
        this.y = index;
        this.next = null;
        this.weight = weight ? weight : 1;
    }
}
exports.default = EdgeNode;
},{}],5:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_V = void 0;
const EdgeNode_1 = __importDefault(require("./EdgeNode"));
exports.MAX_V = 100;
/**
 * An implementation of a graph data structure using edge lists. Inspired by The Algorithm Design Manual.
 */
class Graph {
    /**
     * Constructs a new graph
     * @param directed Whether or not this graph is directed
     */
    constructor(directed = false) {
        this.directed = directed;
        this.weighted = false;
        this.numVertices = 0;
        this.numEdges = 0;
        this.edges = new Array(exports.MAX_V);
        this.degree = new Array(exports.MAX_V);
    }
    /** Adds a node to this graph and returns the index of it
     * @returns The index of the new node
    */
    addNode() {
        // this.numVertices++;
        return this.numVertices++;
    }
    /** Adds an edge between node x and y, with an optional weight
     * @param x The index of the start of the edge
     * @param y The index of the end of the edge
     * @param weight The optional weight of the new edge
    */
    addEdge(x, y, weight) {
        let edge = new EdgeNode_1.default(y, weight);
        if (this.edges[x]) {
            edge.next = this.edges[x];
        }
        this.edges[x] = edge;
        if (!this.directed) {
            edge = new EdgeNode_1.default(x, weight);
            if (this.edges[y]) {
                edge.next = this.edges[y];
            }
            this.edges[y] = edge;
        }
        this.numEdges += 1;
    }
    /**
     * Checks whether or not an edge exists between two nodes.
     * This check is directional if this is a directed graph.
     * @param x The first node
     * @param y The second node
     * @returns true if an edge exists, false otherwise
     */
    edgeExists(x, y) {
        let edge = this.edges[x];
        while (edge !== null) {
            if (edge.y === y) {
                return true;
            }
            edge = edge.next;
        }
    }
    /**
     * Gets the edge list associated with node x
     * @param x The index of the node
     * @returns The head of a linked-list of edges
     */
    getEdges(x) {
        return this.edges[x];
    }
    /**
     * Gets the degree associated with node x
     * @param x The index of the node
     */
    getDegree(x) {
        return this.degree[x];
    }
    /**
     * Converts the specifed node into a string
     * @param index The index of the node to convert to a string
     * @returns The string representation of the node: "Node x"
     */
    nodeToString(index) {
        return "Node " + index;
    }
    /**
     * Converts the Graph into a string format
     * @returns The graph as a string
     */
    toString() {
        let retval = "";
        for (let i = 0; i < this.numVertices; i++) {
            let edge = this.edges[i];
            let edgeStr = "";
            while (edge !== undefined && edge !== null) {
                edgeStr += edge.y.toString();
                if (this.weighted) {
                    edgeStr += " (" + edge.weight + ")";
                }
                if (edge.next !== null) {
                    edgeStr += ", ";
                }
                edge = edge.next;
            }
            retval += this.nodeToString(i) + ": " + edgeStr + "\n";
        }
        return retval;
    }
}
exports.default = Graph;
},{"./EdgeNode":4}],6:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graph_1 = __importStar(require("./Graph"));
/**
 * An extension of Graph that has nodes with positions in 2D space.
 * This is a weighted graph (though not inherently directd)
*/
class PositionGraph extends Graph_1.default {
    /**
     * Createes a new PositionGraph
     * @param directed Whether or not this graph is directed
     */
    constructor(directed = false) {
        super(directed);
        this.debugRender = () => {
            // for(let point of this.positions){
            // 	ctx.fillRect((point.x - origin.x - 4)*zoom, (point.y - origin.y - 4)*zoom, 8, 8);
            // }
        };
        this.positions = new Array(Graph_1.MAX_V);
    }
    /**
     * Adds a positioned node to this graph
     * @param position The position of the node to add
     * @returns The index of the added node
     */
    addPositionedNode(position) {
        this.positions[this.numVertices] = position;
        return this.addNode();
    }
    /**
     * Changes the position of a node.
     * Automatically adjusts the weights of the graph tied to this node.
     * As such, be warned that this function has an O(n + m) running time, and use it sparingly.
     * @param index The index of the node
     * @param position The new position of the node
     */
    setNodePosition(index, position) {
        this.positions[index] = position;
        // Recalculate all weights associated with this index
        for (let i = 0; i < this.numEdges; i++) {
            let edge = this.edges[i];
            while (edge !== null) {
                // If this node is on either side of the edge, recalculate weight
                if (i === index || edge.y === index) {
                    edge.weight = this.positions[i].distanceTo(this.positions[edge.y]);
                }
                edge = edge.next;
            }
        }
    }
    /**
     * Gets the position of a node
     * @param index The index of the node
     * @returns The position of the node
     */
    getNodePosition(index) {
        return this.positions[index];
    }
    /**
     * Adds an edge to this graph between node x and y.
     * Automatically calculates the weight of the edge as the distance between the nodes.
     * @param x The beginning of the edge
     * @param y The end of the edge
     */
    addEdge(x, y) {
        if (!this.positions[x] || !this.positions[y]) {
            throw "Can't add edge to un-positioned node!";
        }
        // Weight is the distance between the nodes
        let weight = this.positions[x].distanceTo(this.positions[y]);
        super.addEdge(x, y, weight);
    }
    // @override
    nodeToString(index) {
        return "Node " + index + " - " + this.positions[index].toString();
    }
}
exports.default = PositionGraph;
},{"./Graph":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegion = void 0;
function isRegion(arg) {
    return arg && arg.size && arg.scale && arg.boundary;
}
exports.isRegion = isRegion;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Associates strings with elements of type T
 */
class Map {
    /** Creates a new map */
    constructor() {
        this.map = {};
    }
    /**
     * Adds a value T stored at a key.
     * @param key The key of the item to be stored
     * @param value The item to be stored
     */
    add(key, value) {
        this.map[key] = value;
    }
    /**
     * Get the value associated with a key.
     * @param key The key of the item
     * @returns The item at the key or undefined
     */
    get(key) {
        return this.map[key];
    }
    /**
     * An alias of add. Sets the value stored at key to the new specified value
     * @param key The key of the item to be stored
     * @param value The item to be stored
     */
    set(key, value) {
        this.add(key, value);
    }
    /**
     * Returns true if there is a value stored at the specified key, false otherwise.
     * @param key The key to check
     * @returns A boolean representing whether or not there is an item at the given key.
     */
    has(key) {
        return this.map[key] !== undefined;
    }
    /**
     * Returns an array of all of the keys in this map.
     * @returns An array containing all keys in the map.
     */
    keys() {
        return Object.keys(this.map);
    }
    // @implemented
    forEach(func) {
        Object.keys(this.map).forEach(key => func(key));
    }
    /**
     * Deletes an item associated with a key
     * @param key The key at which to delete an item
     */
    delete(key) {
        delete this.map[key];
    }
    // @implemented
    clear() {
        this.forEach(key => delete this.map[key]);
    }
    /**
     * Converts this map to a string representation.
     * @returns The string representation of this map.
     */
    toString() {
        let str = "";
        this.forEach((key) => str += key + " -> " + this.get(key).toString() + "\n");
        return str;
    }
}
exports.default = Map;
},{}],9:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("./Vec2"));
/** A 4x4 matrix0 */
class Mat4x4 {
    constructor() {
        this.mat = new Float32Array([
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]);
    }
    // Static members
    static get IDENTITY() {
        return new Mat4x4().identity();
    }
    static get ZERO() {
        return new Mat4x4().zero();
    }
    // Accessors
    set _00(x) {
        this.mat[0] = x;
    }
    set(col, row, value) {
        if (col < 0 || col > 3 || row < 0 || row > 3) {
            throw `Error - index (${col}, ${row}) is out of bounds for Mat4x4`;
        }
        this.mat[row * 4 + col] = value;
        return this;
    }
    get(col, row) {
        return this.mat[row * 4 + col];
    }
    setAll(...items) {
        this.mat.set(items);
        return this;
    }
    identity() {
        return this.setAll(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    zero() {
        return this.setAll(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    /**
     * Makes this Mat4x4 a rotation matrix of the specified number of radians ccw
     * @param zRadians The number of radians to rotate
     * @returns this Mat4x4
     */
    rotate(zRadians) {
        return this.setAll(Math.cos(zRadians), -Math.sin(zRadians), 0, 0, Math.sin(zRadians), Math.cos(zRadians), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /**
     * Turns this Mat4x4 into a translation matrix of the specified translation
     * @param translation The translation in x and y
     * @returns this Mat4x4
     */
    translate(translation) {
        // If translation is a vec, get its array
        if (translation instanceof Vec2_1.default) {
            translation = translation.toArray();
        }
        return this.setAll(1, 0, 0, translation[0], 0, 1, 0, translation[1], 0, 0, 1, 0, 0, 0, 0, 1);
    }
    scale(scale) {
        // Make sure scale is a float32Array
        if (scale instanceof Vec2_1.default) {
            scale = scale.toArray();
        }
        else if (!(scale instanceof Float32Array)) {
            scale = new Float32Array([scale, scale]);
        }
        return this.setAll(scale[0], 0, 0, 0, 0, scale[1], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    /**
     * Returns a new Mat4x4 that represents the right side multiplication THIS x OTHER
     * @param other The other Mat4x4 to multiply by
     * @returns a new Mat4x4 containing the product of these two Mat4x4s
     */
    mult(other, out) {
        let temp = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let value = 0;
                for (let k = 0; k < 4; k++) {
                    value += this.get(k, i) * other.get(j, k);
                }
                temp[j * 4 + i] = value;
            }
        }
        if (out !== undefined) {
            return out.setAll(...temp);
        }
        else {
            return new Mat4x4().setAll(...temp);
        }
    }
    /**
     * Multiplies all given matricies in order. e.g. MULT(A, B, C) -> A*B*C
     * @param mats A list of Mat4x4s to multiply in order
     * @returns A new Mat4x4 holding the result of the operation
     */
    static MULT(...mats) {
        // Create a new array
        let temp = Mat4x4.IDENTITY;
        // Multiply by every array in order, in place
        for (let i = 0; i < mats.length; i++) {
            temp.mult(mats[i], temp);
        }
        return temp;
    }
    toArray() {
        return this.mat;
    }
    toString() {
        return `|${this.mat[0].toFixed(2)}, ${this.mat[1].toFixed(2)}, ${this.mat[2].toFixed(2)}, ${this.mat[3].toFixed(2)}|\n` +
            `|${this.mat[4].toFixed(2)}, ${this.mat[5].toFixed(2)}, ${this.mat[6].toFixed(2)}, ${this.mat[7].toFixed(2)}|\n` +
            `|${this.mat[8].toFixed(2)}, ${this.mat[9].toFixed(2)}, ${this.mat[10].toFixed(2)}, ${this.mat[11].toFixed(2)}|\n` +
            `|${this.mat[12].toFixed(2)}, ${this.mat[13].toFixed(2)}, ${this.mat[14].toFixed(2)}, ${this.mat[15].toFixed(2)}|`;
    }
}
exports.default = Mat4x4;
},{"./Vec2":21}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A class that contains the area of overlap of two colliding objects to allow for sorting by the physics system.
 */
class AreaCollision {
    /**
     * Creates a new AreaCollision object
     * @param area The area of the collision
     * @param collider The other collider
     */
    constructor(area, collider, other, type, tile) {
        this.area = area;
        this.collider = collider;
        this.other = other;
        this.type = type;
        this.tile = tile;
    }
}
exports.default = AreaCollision;
},{}],11:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../Vec2"));
/**
 * An object representing the data collected from a physics hit between two geometric objects.
 * Inspired by the helpful collision documentation @link(here)(https://noonat.github.io/intersect/).
 */
class Hit {
    constructor() {
        /** The near times of the collision */
        this.nearTimes = Vec2_1.default.ZERO;
        /** The position of the collision */
        this.pos = Vec2_1.default.ZERO;
        /** The overlap distance of the hit */
        this.delta = Vec2_1.default.ZERO;
        /** The normal vector of the hit */
        this.normal = Vec2_1.default.ZERO;
    }
}
exports.default = Hit;
},{"../Vec2":21}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A FIFO queue with elements of type T
 */
class Queue {
    /**
     * Constructs a new queue
     * @param maxElements The maximum size of the stack
     */
    constructor(maxElements = 1000000) {
        this.MAX_ELEMENTS = maxElements;
        this.q = new Array(this.MAX_ELEMENTS);
        this.head = 0;
        this.tail = 0;
        this.size = 0;
    }
    /**
     * Adds an item to the back of the queue
     * @param item The item to add to the back of the queue
     */
    enqueue(item) {
        if ((this.tail + 1) % this.MAX_ELEMENTS === this.head) {
            throw new Error("Queue full - cannot add element");
        }
        this.size += 1;
        this.q[this.tail] = item;
        this.tail = (this.tail + 1) % this.MAX_ELEMENTS;
    }
    /**
     * Retrieves an item from the front of the queue
     * @returns The item at the front of the queue
     */
    dequeue() {
        if (this.head === this.tail) {
            throw new Error("Queue empty - cannot remove element");
        }
        this.size -= 1;
        let item = this.q[this.head];
        // Now delete the item
        delete this.q[this.head];
        this.head = (this.head + 1) % this.MAX_ELEMENTS;
        return item;
    }
    /**
     * Returns the item at the front of the queue, but does not remove it
     * @returns The item at the front of the queue
     */
    peekNext() {
        if (this.head === this.tail) {
            throw "Queue empty - cannot get element";
        }
        let item = this.q[this.head];
        return item;
    }
    /**
     * Returns true if the queue has items in it, false otherwise
     * @returns A boolean representing whether or not this queue has items
     */
    hasItems() {
        return this.head !== this.tail;
    }
    /**
     * Returns the number of elements in the queue.
     * @returns The size of the queue
     */
    getSize() {
        return this.size;
    }
    // @implemented
    clear() {
        this.forEach((item, index) => delete this.q[index]);
        this.size = 0;
        this.head = this.tail;
    }
    // @implemented
    forEach(func) {
        let i = this.head;
        while (i !== this.tail) {
            func(this.q[i], i);
            i = (i + 1) % this.MAX_ELEMENTS;
        }
    }
    /**
     * Converts this queue into a string format
     * @returns A string representing this queue
     */
    toString() {
        let retval = "";
        this.forEach((item, index) => {
            let str = item.toString();
            if (index !== 0) {
                str += " -> ";
            }
            retval = str + retval;
        });
        return "Top -> " + retval;
    }
}
exports.default = Queue;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** A container for info about a webGL shader program */
class WebGLProgramType {
    /**
     * Deletes this shader program
     */
    delete(gl) {
        // Clean up all aspects of this program
        if (this.program) {
            gl.deleteProgram(this.program);
        }
        if (this.vertexShader) {
            gl.deleteShader(this.vertexShader);
        }
        if (this.fragmentShader) {
            gl.deleteShader(this.fragmentShader);
        }
    }
}
exports.default = WebGLProgramType;
},{}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shape_1 = __importDefault(require("./Shape"));
const Vec2_1 = __importDefault(require("../Vec2"));
const MathUtils_1 = __importDefault(require("../../Utils/MathUtils"));
const Circle_1 = __importDefault(require("./Circle"));
const Hit_1 = __importDefault(require("../Physics/Hit"));
/**
 * An Axis-Aligned Bounding Box. In other words, a rectangle that is always aligned to the x-y grid.
 * Inspired by the helpful collision documentation @link(here)(https://noonat.github.io/intersect/).
 */
class AABB extends Shape_1.default {
    /**
     * Creates a new AABB
     * @param center The center of the AABB
     * @param halfSize The half size of the AABB - The distance from the center to an edge in x and y
     */
    constructor(center, halfSize) {
        super();
        this.center = center ? center : new Vec2_1.default(0, 0);
        this.halfSize = halfSize ? halfSize : new Vec2_1.default(0, 0);
    }
    /** Returns a point representing the top left corner of the AABB */
    get topLeft() {
        return new Vec2_1.default(this.left, this.top);
    }
    /** Returns a point representing the top right corner of the AABB */
    get topRight() {
        return new Vec2_1.default(this.right, this.top);
    }
    /** Returns a point representing the bottom left corner of the AABB */
    get bottomLeft() {
        return new Vec2_1.default(this.left, this.bottom);
    }
    /** Returns a point representing the bottom right corner of the AABB */
    get bottomRight() {
        return new Vec2_1.default(this.right, this.bottom);
    }
    // @override
    getBoundingRect() {
        return this.clone();
    }
    // @override
    getBoundingCircle() {
        let r = Math.max(this.hw, this.hh);
        return new Circle_1.default(this.center.clone(), r);
    }
    // @deprecated
    getHalfSize() {
        return this.halfSize;
    }
    // @deprecated
    setHalfSize(halfSize) {
        this.halfSize = halfSize;
    }
    // TODO - move these all to the Shape class
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    containsPoint(point) {
        return point.x >= this.x - this.hw && point.x <= this.x + this.hw
            && point.y >= this.y - this.hh && point.y <= this.y + this.hh;
    }
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    intersectPoint(point) {
        let dx = point.x - this.x;
        let px = this.hw - Math.abs(dx);
        if (px <= 0) {
            return false;
        }
        let dy = point.y - this.y;
        let py = this.hh - Math.abs(dy);
        if (py <= 0) {
            return false;
        }
        return true;
    }
    /**
     * A boolean check of whether this AABB contains a point with soft left and top boundaries.
     * In other words, if the top left is (0, 0), the point (0, 0) is not in the AABB
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    containsPointSoft(point) {
        return point.x > this.x - this.hw && point.x <= this.x + this.hw
            && point.y > this.y - this.hh && point.y <= this.y + this.hh;
    }
    /**
     * Returns the data from the intersection of this AABB with a line segment from a point in a direction
     * @param point The point that the line segment starts from
     * @param delta The direction and distance of the segment
     * @param padding Pads the AABB to make it wider for the intersection test
     * @returns The Hit object representing the intersection, or null if there was no intersection
     */
    intersectSegment(point, delta, padding) {
        let paddingX = padding ? padding.x : 0;
        let paddingY = padding ? padding.y : 0;
        let scaleX = 1 / delta.x;
        let scaleY = 1 / delta.y;
        let signX = MathUtils_1.default.sign(scaleX);
        let signY = MathUtils_1.default.sign(scaleY);
        let tnearx = scaleX * (this.x - signX * (this.hw + paddingX) - point.x);
        let tneary = scaleY * (this.y - signY * (this.hh + paddingY) - point.y);
        let tfarx = scaleX * (this.x + signX * (this.hw + paddingX) - point.x);
        let tfary = scaleY * (this.y + signY * (this.hh + paddingY) - point.y);
        if (tnearx > tfary || tneary > tfarx) {
            // We aren't colliding - we clear one axis before intersecting another
            return null;
        }
        let tnear = Math.max(tnearx, tneary);
        // Double check for NaNs
        if (tnearx !== tnearx) {
            tnear = tneary;
        }
        else if (tneary !== tneary) {
            tnear = tnearx;
        }
        let tfar = Math.min(tfarx, tfary);
        if (tnear === -Infinity) {
            return null;
        }
        if (tnear >= 1 || tfar <= 0) {
            return null;
        }
        // We are colliding
        let hit = new Hit_1.default();
        hit.time = MathUtils_1.default.clamp01(tnear);
        hit.nearTimes.x = tnearx;
        hit.nearTimes.y = tneary;
        if (tnearx > tneary) {
            // We hit on the left or right size
            hit.normal.x = -signX;
            hit.normal.y = 0;
        }
        else if (Math.abs(tnearx - tneary) < 0.0001) {
            // We hit on the corner
            hit.normal.x = -signX;
            hit.normal.y = -signY;
            hit.normal.normalize();
        }
        else {
            // We hit on the top or bottom
            hit.normal.x = 0;
            hit.normal.y = -signY;
        }
        hit.delta.x = (1.0 - hit.time) * -delta.x;
        hit.delta.y = (1.0 - hit.time) * -delta.y;
        hit.pos.x = point.x + delta.x * hit.time;
        hit.pos.y = point.y + delta.y * hit.time;
        return hit;
    }
    // @override
    overlaps(other) {
        if (other instanceof AABB) {
            return this.overlapsAABB(other);
        }
        throw "Overlap not defined between these shapes.";
    }
    /**
     * A simple boolean check of whether this AABB overlaps another
     * @param other The other AABB to check against
     * @returns True if this AABB overlaps the other, false otherwise
     */
    overlapsAABB(other) {
        let dx = other.x - this.x;
        let px = this.hw + other.hw - Math.abs(dx);
        if (px <= 0) {
            return false;
        }
        let dy = other.y - this.y;
        let py = this.hh + other.hh - Math.abs(dy);
        if (py <= 0) {
            return false;
        }
        return true;
    }
    /**
     * Determines whether these AABBs are JUST touching - not overlapping.
     * Vec2.x is -1 if the other is to the left, 1 if to the right.
     * Likewise, Vec2.y is -1 if the other is on top, 1 if on bottom.
     * @param other The other AABB to check
     * @returns The collision sides stored in a Vec2 if the AABBs are touching, null otherwise
     */
    touchesAABB(other) {
        let dx = other.x - this.x;
        let px = this.hw + other.hw - Math.abs(dx);
        let dy = other.y - this.y;
        let py = this.hh + other.hh - Math.abs(dy);
        // If one axis is just touching and the other is overlapping, true
        if ((px === 0 && py >= 0) || (py === 0 && px >= 0)) {
            let ret = new Vec2_1.default();
            if (px === 0) {
                ret.x = other.x < this.x ? -1 : 1;
            }
            if (py === 0) {
                ret.y = other.y < this.y ? -1 : 1;
            }
            return ret;
        }
        else {
            return null;
        }
    }
    /**
     * Determines whether these AABBs are JUST touching - not overlapping.
     * Also, if they are only touching corners, they are considered not touching.
     * Vec2.x is -1 if the other is to the left, 1 if to the right.
     * Likewise, Vec2.y is -1 if the other is on top, 1 if on bottom.
     * @param other The other AABB to check
     * @returns The side of the touch, stored as a Vec2, or null if there is no touch
     */
    touchesAABBWithoutCorners(other) {
        let dx = other.x - this.x;
        let px = this.hw + other.hw - Math.abs(dx);
        let dy = other.y - this.y;
        let py = this.hh + other.hh - Math.abs(dy);
        // If one axis is touching, and the other is strictly overlapping
        if ((px === 0 && py > 0) || (py === 0 && px > 0)) {
            let ret = new Vec2_1.default();
            if (px === 0) {
                ret.x = other.x < this.x ? -1 : 1;
            }
            else {
                ret.y = other.y < this.y ? -1 : 1;
            }
            return ret;
        }
        else {
            return null;
        }
    }
    /**
     * Calculates the area of the overlap between this AABB and another
     * @param other The other AABB
     * @returns The area of the overlap between the AABBs
     */
    overlapArea(other) {
        let leftx = Math.max(this.x - this.hw, other.x - other.hw);
        let rightx = Math.min(this.x + this.hw, other.x + other.hw);
        let dx = rightx - leftx;
        let lefty = Math.max(this.y - this.hh, other.y - other.hh);
        let righty = Math.min(this.y + this.hh, other.y + other.hh);
        let dy = righty - lefty;
        if (dx < 0 || dy < 0)
            return 0;
        return dx * dy;
    }
    /**
     * Moves and resizes this rect from its current position to the position specified
     * @param velocity The movement of the rect from its position
     * @param fromPosition A position specified to be the starting point of sweeping
     * @param halfSize The halfSize of the sweeping rect
     */
    sweep(velocity, fromPosition, halfSize) {
        if (!fromPosition) {
            fromPosition = this.center;
        }
        if (!halfSize) {
            halfSize = this.halfSize;
        }
        let centerX = fromPosition.x + velocity.x / 2;
        let centerY = fromPosition.y + velocity.y / 2;
        let minX = Math.min(fromPosition.x - halfSize.x, fromPosition.x + velocity.x - halfSize.x);
        let minY = Math.min(fromPosition.y - halfSize.y, fromPosition.y + velocity.y - halfSize.y);
        this.center.set(centerX, centerY);
        this.halfSize.set(centerX - minX, centerY - minY);
    }
    // @override
    clone() {
        return new AABB(this.center.clone(), this.halfSize.clone());
    }
    /**
     * Converts this AABB to a string format
     * @returns (center: (x, y), halfSize: (x, y))
     */
    toString() {
        return "(center: " + this.center.toString() + ", half-size: " + this.halfSize.toString() + ")";
    }
}
exports.default = AABB;
},{"../../Utils/MathUtils":100,"../Physics/Hit":11,"../Vec2":21,"./Circle":15,"./Shape":16}],15:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../Vec2"));
const AABB_1 = __importDefault(require("./AABB"));
const Shape_1 = __importDefault(require("./Shape"));
/**
 * A Circle
 */
class Circle extends Shape_1.default {
    /**
     * Creates a new Circle
     * @param center The center of the circle
     * @param radius The radius of the circle
     */
    constructor(center, radius) {
        super();
        this._center = center ? center : new Vec2_1.default(0, 0);
        this.radius = radius ? radius : 0;
    }
    get center() {
        return this._center;
    }
    set center(center) {
        this._center = center;
    }
    get halfSize() {
        return new Vec2_1.default(this.radius, this.radius);
    }
    get r() {
        return this.radius;
    }
    set r(radius) {
        this.radius = radius;
    }
    // @override
    /**
     * A simple boolean check of whether this AABB contains a point
     * @param point The point to check
     * @returns A boolean representing whether this AABB contains the specified point
     */
    containsPoint(point) {
        return this.center.distanceSqTo(point) <= this.radius * this.radius;
    }
    // @override
    getBoundingRect() {
        return new AABB_1.default(this._center.clone(), new Vec2_1.default(this.radius, this.radius));
    }
    // @override
    getBoundingCircle() {
        return this.clone();
    }
    // @override
    overlaps(other) {
        throw new Error("Method not implemented.");
    }
    // @override
    clone() {
        return new Circle(this._center.clone(), this.radius);
    }
    toString() {
        return "(center: " + this.center.toString() + ", radius: " + this.radius + ")";
    }
}
exports.default = Circle;
},{"../Vec2":21,"./AABB":14,"./Shape":16}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../Vec2"));
const AABB_1 = __importDefault(require("./AABB"));
/**
 * An abstract Shape class that acts as an interface for better interactions with subclasses.
 */
class Shape {
    get x() {
        return this.center.x;
    }
    get y() {
        return this.center.y;
    }
    get hw() {
        return this.halfSize.x;
    }
    get hh() {
        return this.halfSize.y;
    }
    get top() {
        return this.y - this.hh;
    }
    get bottom() {
        return this.y + this.hh;
    }
    get left() {
        return this.x - this.hw;
    }
    get right() {
        return this.x + this.hw;
    }
    static getTimeOfCollision(A, velA, B, velB) {
        if (A instanceof AABB_1.default && B instanceof AABB_1.default) {
            return Shape.getTimeOfCollision_AABB_AABB(A, velA, B, velB);
        }
    }
    static getTimeOfCollision_AABB_AABB(A, velA, B, velB) {
        let posSmaller = A.center;
        let posLarger = B.center;
        let sizeSmaller = A.halfSize;
        let sizeLarger = B.halfSize;
        let firstContact = new Vec2_1.default(0, 0);
        let lastContact = new Vec2_1.default(0, 0);
        let collidingX = false;
        let collidingY = false;
        // Sort by position
        if (posLarger.x < posSmaller.x) {
            // Swap, because smaller is further right than larger
            let temp;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
            temp = velA;
            velA = velB;
            velB = temp;
        }
        // A is left, B is right
        firstContact.x = Infinity;
        lastContact.x = Infinity;
        if (posLarger.x - sizeLarger.x >= posSmaller.x + sizeSmaller.x) {
            // If we aren't currently colliding
            let relVel = velA.x - velB.x;
            if (relVel > 0) {
                // If they are moving towards each other
                firstContact.x = ((posLarger.x - sizeLarger.x) - (posSmaller.x + sizeSmaller.x)) / (relVel);
                lastContact.x = ((posLarger.x + sizeLarger.x) - (posSmaller.x - sizeSmaller.x)) / (relVel);
            }
        }
        else {
            collidingX = true;
        }
        if (posLarger.y < posSmaller.y) {
            // Swap, because smaller is further up than larger
            let temp;
            temp = sizeSmaller;
            sizeSmaller = sizeLarger;
            sizeLarger = temp;
            temp = posSmaller;
            posSmaller = posLarger;
            posLarger = temp;
            temp = velA;
            velA = velB;
            velB = temp;
        }
        // A is top, B is bottom
        firstContact.y = Infinity;
        lastContact.y = Infinity;
        if (posLarger.y - sizeLarger.y >= posSmaller.y + sizeSmaller.y) {
            // If we aren't currently colliding
            let relVel = velA.y - velB.y;
            if (relVel > 0) {
                // If they are moving towards each other
                firstContact.y = ((posLarger.y - sizeLarger.y) - (posSmaller.y + sizeSmaller.y)) / (relVel);
                lastContact.y = ((posLarger.y + sizeLarger.y) - (posSmaller.y - sizeSmaller.y)) / (relVel);
            }
        }
        else {
            collidingY = true;
        }
        return [firstContact, lastContact, collidingX, collidingY];
    }
}
exports.default = Shape;
},{"../Vec2":21,"./AABB":14}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A LIFO stack with items of type T
 */
class Stack {
    /**
     * Constructs a new stack
     * @param maxElements The maximum size of the stack
     */
    constructor(maxElements = 100) {
        this.MAX_ELEMENTS = maxElements;
        this.stack = new Array(this.MAX_ELEMENTS);
        this.head = -1;
    }
    /**
     * Adds an item to the top of the stack
     * @param item The new item to add to the stack
     */
    push(item) {
        if (this.head + 1 === this.MAX_ELEMENTS) {
            throw "Stack full - cannot add element";
        }
        this.head += 1;
        this.stack[this.head] = item;
    }
    /**
     * Removes an item from the top of the stack
     * @returns The item at the top of the stack
     */
    pop() {
        if (this.head === -1) {
            throw "Stack empty - cannot remove element";
        }
        this.head -= 1;
        return this.stack[this.head + 1];
    }
    /**
     * Returns the element currently at the top of the stack
     * @returns The item at the top of the stack
     */
    peek() {
        if (this.head === -1) {
            throw "Stack empty - cannot get element";
        }
        return this.stack[this.head];
    }
    /** Returns true if this stack is empty
     * @returns A boolean that represents whether or not the stack is empty
    */
    isEmpty() {
        return this.head === -1;
    }
    // @implemented
    clear() {
        this.forEach((item, index) => delete this.stack[index]);
        this.head = -1;
    }
    /**
     * Returns the number of items currently in the stack
     * @returns The number of items in the stack
     */
    size() {
        return this.head + 1;
    }
    // @implemented
    forEach(func) {
        let i = 0;
        while (i <= this.head) {
            func(this.stack[i], i);
            i += 1;
        }
    }
    /**
     * Converts this stack into a string format
     * @returns A string representing this stack
     */
    toString() {
        let retval = "";
        this.forEach((item, index) => {
            let str = item.toString();
            if (index !== 0) {
                str += " -> ";
            }
            retval = str + retval;
        });
        return "Top -> " + retval;
    }
}
exports.default = Stack;
},{}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Emitter_1 = __importDefault(require("../../Events/Emitter"));
/**
 * An abstract implementation of a state for a @reference[StateMachine].
 * This class should be extended to allow for custom state behaviors.
 */
class State {
    /**
     * Constructs a new State
     * @param parent The parent StateMachine of this state
     */
    constructor(parent) {
        this.parent = parent;
        this.emitter = new Emitter_1.default();
    }
    /**
     * Tells the state machine that this state has ended, and makes it transition to the new state specified
     * @param stateName The name of the state to transition to
     */
    finished(stateName) {
        this.parent.changeState(stateName);
    }
}
exports.default = State;
},{"../../Events/Emitter":24}],19:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stack_1 = __importDefault(require("../Stack"));
const Map_1 = __importDefault(require("../Map"));
const Receiver_1 = __importDefault(require("../../Events/Receiver"));
const Emitter_1 = __importDefault(require("../../Events/Emitter"));
/**
 * An implementation of a Push Down Automata State machine. States can also be hierarchical
 * for more flexibility, as described in @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/state.html).
 */
class StateMachine {
    /**
     * Creates a new StateMachine
     */
    constructor() {
        this.stack = new Stack_1.default();
        this.stateMap = new Map_1.default();
        this.receiver = new Receiver_1.default();
        this.emitter = new Emitter_1.default();
        this.emitEventOnStateChange = false;
    }
    /**
     * Sets the activity state of this state machine
     * @param flag True if you want to set this machine running, false otherwise
     */
    setActive(flag) {
        this.active = flag;
    }
    /**
     * Makes this state machine emit an event any time its state changes
     * @param stateChangeEventName The name of the event to emit
     */
    setEmitEventOnStateChange(stateChangeEventName) {
        this.emitEventOnStateChange = true;
        this.stateChangeEventName = stateChangeEventName;
    }
    /**
     * Stops this state machine from emitting events on state change.
     */
    cancelEmitEventOnStateChange() {
        this.emitEventOnStateChange = false;
    }
    /**
     * Initializes this state machine with an initial state and sets it running
     * @param initialState The name of initial state of the state machine
     */
    initialize(initialState, options) {
        this.stack.push(this.stateMap.get(initialState));
        this.currentState = this.stack.peek();
        this.currentState.onEnter(options);
        this.setActive(true);
    }
    /**
     * Adds a state to this state machine
     * @param stateName The name of the state to add
     * @param state The state to add
     */
    addState(stateName, state) {
        this.stateMap.add(stateName, state);
    }
    /**
     * Changes the state of this state machine to the provided string
     * @param state The string name of the state to change to
     */
    changeState(state) {
        // Exit the current state
        let options = this.currentState.onExit();
        // Make sure the correct state is at the top of the stack
        // This if-statement with the "previous" thing shouldn't be here IMO - PeteyLumpkins
        if (state === "previous") {
            // Pop the current state off the stack
            this.stack.pop();
        }
        else {
            // Retrieve the new state from the statemap and put it at the top of the stack
            this.stack.pop();
            this.stack.push(this.stateMap.get(state));
        }
        // Retreive the new state from the stack
        this.currentState = this.stack.peek();
        // Emit an event if turned on
        if (this.emitEventOnStateChange) {
            this.emitter.fireEvent(this.stateChangeEventName, { state: this.currentState });
        }
        // Enter the new state
        this.currentState.onEnter(options);
    }
    /**
     * Handles input. This happens at the very beginning of this state machine's update cycle.
     * @param event The game event to process
     */
    handleEvent(event) {
        if (this.active) {
            this.currentState.handleInput(event);
        }
    }
    // @implemented
    update(deltaT) {
        // Distribute events
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            this.handleEvent(event);
        }
        // Delegate the update to the current state
        this.currentState.update(deltaT);
    }
}
exports.default = StateMachine;
},{"../../Events/Emitter":24,"../../Events/Receiver":28,"../Map":8,"../Stack":17}],20:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const Vec2_1 = __importDefault(require("../Vec2"));
/**
 * The data representation of a Tileset for the game engine. This represents one image,
 * with a startIndex if required (as it is with Tiled using two images in one tilset).
 */
class Tileset {
    // TODO: Change this to be more general and work with other tileset formats
    constructor(tilesetData) {
        // Defer handling of the data to a helper class
        this.initFromTiledData(tilesetData);
    }
    /**
     * Initialize the tileset from the data from a Tiled json file
     * @param tiledData The parsed object from a Tiled json file
     */
    initFromTiledData(tiledData) {
        this.numRows = tiledData.tilecount / tiledData.columns;
        this.numCols = tiledData.columns;
        this.startIndex = tiledData.firstgid;
        this.endIndex = this.startIndex + tiledData.tilecount - 1;
        this.tileSize = new Vec2_1.default(tiledData.tilewidth, tiledData.tilewidth);
        this.imageKey = tiledData.image;
        this.imageSize = new Vec2_1.default(tiledData.imagewidth, tiledData.imageheight);
    }
    /**
     * Gets the image key associated with this tilemap
     * @returns The image key of this tilemap
     */
    getImageKey() {
        return this.imageKey;
    }
    /**
     * Returns a Vec2 containing the left and top offset from the image origin for this tile.
     * @param tileIndex The index of the tile from startIndex to endIndex of this tileset
     * @returns A Vec2 containing the offset for the specified tile.
     */
    getImageOffsetForTile(tileIndex) {
        // Get the true index
        let index = tileIndex - this.startIndex;
        let row = Math.floor(index / this.numCols);
        let col = index % this.numCols;
        let width = this.tileSize.x;
        let height = this.tileSize.y;
        // Calculate the position to start a crop in the tileset image
        let left = col * width;
        let top = row * height;
        return new Vec2_1.default(left, top);
    }
    /**
     * Gets the start index
     * @returns The start index
     */
    getStartIndex() {
        return this.startIndex;
    }
    /**
     * Gets the tile set
     * @returns A Vec2 containing the tile size
     */
    getTileSize() {
        return this.tileSize;
    }
    /**
     * Gets the number of rows in the tileset
     * @returns The number of rows
     */
    getNumRows() {
        return this.numRows;
    }
    /**
     * Gets the number of columns in the tilset
     * @returns The number of columns
     */
    getNumCols() {
        return this.numCols;
    }
    getTileCount() {
        return this.endIndex - this.startIndex + 1;
    }
    /**
     * Checks whether or not this tilset contains the specified tile index. This is used for rendering.
     * @param tileIndex The index of the tile to check
     * @returns A boolean representing whether or not this tilset uses the specified index
     */
    hasTile(tileIndex) {
        return tileIndex >= this.startIndex && tileIndex <= this.endIndex;
    }
    /**
     * Render a singular tile with index tileIndex from the tileset located at position dataIndex
     * @param ctx The rendering context
     * @param tileIndex The value of the tile to render
     * @param dataIndex The index of the tile in the data array
     * @param worldSize The size of the world
     * @param origin The viewport origin in the current layer
     * @param scale The scale of the tilemap
     */
    renderTile(ctx, tileIndex, dataIndex, maxCols, origin, scale, zoom) {
        let image = ResourceManager_1.default.getInstance().getImage(this.imageKey);
        // Get the true index
        let index = tileIndex - this.startIndex;
        let row = Math.floor(index / this.numCols);
        let col = index % this.numCols;
        let width = this.tileSize.x;
        let height = this.tileSize.y;
        // Calculate the position to start a crop in the tileset image
        let left = col * width;
        let top = row * height;
        // Calculate the position in the world to render the tile
        let x = Math.floor((dataIndex % maxCols) * width * scale.x);
        let y = Math.floor(Math.floor(dataIndex / maxCols) * height * scale.y);
        ctx.drawImage(image, left, top, width, height, Math.floor((x - origin.x) * zoom), Math.floor((y - origin.y) * zoom), Math.ceil(width * scale.x * zoom), Math.ceil(height * scale.y * zoom));
    }
}
exports.default = Tileset;
},{"../../ResourceManager/ResourceManager":81,"../Vec2":21}],21:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("../Utils/MathUtils"));
/**
 * A two-dimensional vector (x, y)
 */
class Vec2 {
    /**
     * Creates a new Vec2
     * @param x The x value of the vector
     * @param y The y value of the vector
     */
    constructor(x = 0, y = 0) {
        /**
         * When this vector changes its value, do something
         */
        this.onChange = () => { };
        this.vec = new Float32Array(2);
        this.vec[0] = x;
        this.vec[1] = y;
    }
    // Expose x and y with getters and setters
    get x() {
        return this.vec[0];
    }
    set x(x) {
        this.vec[0] = x;
        if (this.onChange) {
            this.onChange();
        }
    }
    get y() {
        return this.vec[1];
    }
    set y(y) {
        this.vec[1] = y;
        if (this.onChange) {
            this.onChange();
        }
    }
    static get ZERO() {
        return new Vec2(0, 0);
    }
    static get INF() {
        return new Vec2(Infinity, Infinity);
    }
    static get UP() {
        return new Vec2(0, -1);
    }
    static get DOWN() {
        return new Vec2(0, 1);
    }
    static get LEFT() {
        return new Vec2(-1, 0);
    }
    static get RIGHT() {
        return new Vec2(1, 0);
    }
    /**
     * The squared magnitude of the vector. This tends to be faster, so use it in situations where taking the
     * square root doesn't matter, like for comparing distances.
     * @returns The squared magnitude of the vector
     */
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * The magnitude of the vector.
     * @returns The magnitude of the vector.
     */
    mag() {
        return Math.sqrt(this.magSq());
    }
    /**
     * Divdes x and y by the magnitude to obtain the unit vector in the direction of this vector.
     * @returns This vector as a unit vector.
     */
    normalize() {
        if (this.x === 0 && this.y === 0)
            return this;
        let mag = this.mag();
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    /**
     * Works like normalize(), but returns a new Vec2
     * @returns A new vector that is the unit vector for this one
     */
    normalized() {
        if (this.isZero()) {
            return this;
        }
        let mag = this.mag();
        return new Vec2(this.x / mag, this.y / mag);
    }
    /**
     * Sets the x and y elements of this vector to zero.
     * @returns This vector, with x and y set to zero.
     */
    zero() {
        return this.set(0, 0);
    }
    /**
     * Sets the vector's x and y based on the angle provided. Goes counter clockwise.
     * @param angle The angle in radians
     * @param radius The magnitude of the vector at the specified angle
     * @returns This vector.
     */
    setToAngle(angle, radius = 1) {
        this.x = MathUtils_1.default.floorToPlace(Math.cos(angle) * radius, 5);
        this.y = MathUtils_1.default.floorToPlace(-Math.sin(angle) * radius, 5);
        return this;
    }
    /**
     * Returns a vector that point from this vector to another one
     * @param other The vector to point to
     * @returns A new Vec2 that points from this vector to the one provided
     */
    vecTo(other) {
        return new Vec2(other.x - this.x, other.y - this.y);
    }
    /**
     * Returns a vector containing the direction from this vector to another
     * @param other The vector to point to
     * @returns A new Vec2 that points from this vector to the one provided. This new Vec2 will be a unit vector.
     */
    dirTo(other) {
        return this.vecTo(other).normalize();
    }
    /**
     * Keeps the vector's direction, but sets its magnitude to be the provided magnitude
     * @param magnitude The magnitude the vector should be
     * @returns This vector with its magnitude set to the new magnitude
     */
    scaleTo(magnitude) {
        return this.normalize().scale(magnitude);
    }
    /**
     * Scales x and y by the number provided, or if two number are provided, scales them individually.
     * @param factor The scaling factor for the vector, or for only the x-component if yFactor is provided
     * @param yFactor The scaling factor for the y-component of the vector
     * @returns This vector after scaling
     */
    scale(factor, yFactor = null) {
        if (yFactor !== null) {
            this.x *= factor;
            this.y *= yFactor;
            return this;
        }
        this.x *= factor;
        this.y *= factor;
        return this;
    }
    /**
     * Returns a scaled version of this vector without modifying it.
     * @param factor The scaling factor for the vector, or for only the x-component if yFactor is provided
     * @param yFactor The scaling factor for the y-component of the vector
     * @returns A new vector that has the values of this vector after scaling
     */
    scaled(factor, yFactor = null) {
        return this.clone().scale(factor, yFactor);
    }
    /**
     * Rotates the vector counter-clockwise by the angle amount specified
     * @param angle The angle to rotate by in radians
     * @returns This vector after rotation.
     */
    rotateCCW(angle) {
        let cs = Math.cos(angle);
        let sn = Math.sin(angle);
        let tempX = this.x * cs - this.y * sn;
        let tempY = this.x * sn + this.y * cs;
        this.x = tempX;
        this.y = tempY;
        return this;
    }
    /**
     * Sets the vectors coordinates to be the ones provided
     * @param x The new x value for this vector
     * @param y The new y value for this vector
     * @returns This vector
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Copies the values of the other Vec2 into this one.
     * @param other The Vec2 to copy
     * @returns This vector with its values set to the vector provided
     */
    copy(other) {
        return this.set(other.x, other.y);
    }
    /**
     * Adds this vector the another vector
     * @param other The Vec2 to add to this one
     * @returns This vector after adding the one provided
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * Increments the fields of this vector. Both are incremented with a, if only a is provided.
     * @param a The first number to increment by
     * @param b The second number to increment by
     * @returnss This vector after incrementing
     */
    inc(a, b) {
        if (b === undefined) {
            this.x += a;
            this.y += a;
        }
        else {
            this.x += a;
            this.y += b;
        }
        return this;
    }
    /**
     * Subtracts another vector from this vector
     * @param other The Vec2 to subtract from this one
     * @returns This vector after subtracting the one provided
     */
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    /**
     * Multiplies this vector with another vector element-wise. In other words, this.x *= other.x and this.y *= other.y
     * @param other The Vec2 to multiply this one by
     * @returns This vector after multiplying its components by this one
     */
    mult(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }
    /**
     * Divides this vector with another vector element-wise. In other words, this.x /= other.x and this.y /= other.y
     * @param other The vector to divide this one by
     * @returns This vector after division
     */
    div(other) {
        if (other.x === 0 || other.y === 0)
            throw "Divide by zero error";
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }
    /**
     * Does an element wise remainder operation on this vector. this.x %= other.x and this.y %= other.y
     * @param other The other vector
     * @returns this vector
     */
    remainder(other) {
        this.x = this.x % other.x;
        this.y = this.y % other.y;
        return this;
    }
    /**
     * Returns the squared distance between this vector and another vector
     * @param other The vector to compute distance squared to
     * @returns The squared distance between this vector and the one provided
     */
    distanceSqTo(other) {
        return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y);
    }
    /**
     * Returns the distance between this vector and another vector
     * @param other The vector to compute distance to
     * @returns The distance between this vector and the one provided
     */
    distanceTo(other) {
        return Math.sqrt(this.distanceSqTo(other));
    }
    /**
     * Returns the dot product of this vector and another
     * @param other The vector to compute the dot product with
     * @returns The dot product of this vector and the one provided.
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /**
     * Returns the angle counter-clockwise in radians from this vector to another vector
     * @param other The vector to compute the angle to
     * @returns The angle, rotating CCW, from this vector to the other vector
     */
    angleToCCW(other) {
        let dot = this.dot(other);
        let det = this.x * other.y - this.y * other.x;
        let angle = -Math.atan2(det, dot);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }
    /**
     * Returns a string representation of this vector rounded to 1 decimal point
     * @returns This vector as a string
     */
    toString() {
        return this.toFixed();
    }
    /**
     * Returns a string representation of this vector rounded to the specified number of decimal points
     * @param numDecimalPoints The number of decimal points to create a string to
     * @returns This vector as a string
     */
    toFixed(numDecimalPoints = 1) {
        return "(" + this.x.toFixed(numDecimalPoints) + ", " + this.y.toFixed(numDecimalPoints) + ")";
    }
    /**
     * Returns a new vector with the same coordinates as this one.
     * @returns A new Vec2 with the same values as this one
     */
    clone() {
        return new Vec2(this.x, this.y);
    }
    /**
     * Returns true if this vector and other have the EXACT same x and y (not assured to be safe for floats)
     * @param other The vector to check against
     * @returns A boolean representing the equality of the two vectors
     */
    strictEquals(other) {
        return this.x === other.x && this.y === other.y;
    }
    /**
     * Returns true if this vector and other have the same x and y
     * @param other The vector to check against
     * @returns A boolean representing the equality of the two vectors
     */
    equals(other) {
        let xEq = Math.abs(this.x - other.x) < 0.0000001;
        let yEq = Math.abs(this.y - other.y) < 0.0000001;
        return xEq && yEq;
    }
    /**
     * Returns true if this vector is the zero vector exactly (not assured to be safe for floats).
     * @returns A boolean representing the equality of this vector and the zero vector
     */
    strictIsZero() {
        return this.x === 0 && this.y === 0;
    }
    /**
     * Returns true if this x and y for this vector are both zero.
     * @returns A boolean representing the equality of this vector and the zero vector
     */
    isZero() {
        return Math.abs(this.x) < 0.0000001 && Math.abs(this.y) < 0.0000001;
    }
    /**
     * Sets the function that is called whenever this vector is changed.
     * @param f The function to be called
     */
    setOnChange(f) {
        this.onChange = f;
    }
    toArray() {
        return this.vec;
    }
    /**
     * Performs linear interpolation between two vectors
     * @param a The first vector
     * @param b The second vector
     * @param t The time of the lerp, with 0 being vector A, and 1 being vector B
     * @returns A new Vec2 representing the lerp between vector a and b.
     */
    static lerp(a, b, t) {
        return new Vec2(MathUtils_1.default.lerp(a.x, b.x, t), MathUtils_1.default.lerp(a.y, b.y, t));
    }
}
exports.default = Vec2;
Vec2.ZERO_STATIC = new Vec2(0, 0);
},{"../Utils/MathUtils":100}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const Color_1 = __importDefault(require("../Utils/Color"));
/**
 * A util class for rendering Debug messages to the canvas.
 */
class Debug {
    /**
     * Add a message to display on the debug screen
     * @param id A unique ID for this message
     * @param messages The messages to print to the debug screen
     */
    static log(id, ...messages) {
        // let message = "";
        // for(let i = 0; i < messages.length; i++){
        // 	message += messages[i].toString();
        // }
        // Join all messages with spaces
        let message = messages.map((m) => m.toString()).join(" ");
        this.logMessages.add(id, message);
    }
    /**
     * Deletes a a key from the log and stops it from keeping up space on the screen
     * @param id The id of the log item to clear
     */
    static clearLogItem(id) {
        this.logMessages.delete(id);
    }
    /**
     * Sets the list of nodes to render with the debugger
     * @param nodes The new list of nodes
     */
    static setNodes(nodes) {
        this.nodes = nodes;
    }
    /**
     * Draws a box at the specified position
     * @param center The center of the box
     * @param halfSize The dimensions of the box
     * @param filled A boolean for whether or not the box is filled
     * @param color The color of the box to draw
     */
    static drawBox(center, halfSize, filled, color) {
        let alpha = this.debugRenderingContext.globalAlpha;
        this.debugRenderingContext.globalAlpha = color.a;
        if (filled) {
            this.debugRenderingContext.fillStyle = color.toString();
            this.debugRenderingContext.fillRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x * 2, halfSize.y * 2);
        }
        else {
            let lineWidth = 2;
            this.debugRenderingContext.lineWidth = lineWidth;
            this.debugRenderingContext.strokeStyle = color.toString();
            this.debugRenderingContext.strokeRect(center.x - halfSize.x, center.y - halfSize.y, halfSize.x * 2, halfSize.y * 2);
        }
        this.debugRenderingContext.globalAlpha = alpha;
    }
    /**
     * Draws a circle at the specified position
     * @param center The center of the circle
     * @param radius The dimensions of the box
     * @param filled A boolean for whether or not the circle is filled
     * @param color The color of the circle
     */
    static drawCircle(center, radius, filled, color) {
        let alpha = this.debugRenderingContext.globalAlpha;
        this.debugRenderingContext.globalAlpha = color.a;
        if (filled) {
            this.debugRenderingContext.fillStyle = color.toString();
            this.debugRenderingContext.beginPath();
            this.debugRenderingContext.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            this.debugRenderingContext.closePath();
            this.debugRenderingContext.fill();
        }
        else {
            let lineWidth = 2;
            this.debugRenderingContext.lineWidth = lineWidth;
            this.debugRenderingContext.strokeStyle = color.toString();
            this.debugRenderingContext.beginPath();
            this.debugRenderingContext.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            this.debugRenderingContext.closePath();
            this.debugRenderingContext.stroke();
        }
        this.debugRenderingContext.globalAlpha = alpha;
    }
    /**
     * Draws a ray at the specified position
     * @param from The starting position of the ray
     * @param to The ending position of the ray
     * @param color The color of the ray
     */
    static drawRay(from, to, color) {
        this.debugRenderingContext.lineWidth = 2;
        this.debugRenderingContext.strokeStyle = color.toString();
        this.debugRenderingContext.beginPath();
        this.debugRenderingContext.moveTo(from.x, from.y);
        this.debugRenderingContext.lineTo(to.x, to.y);
        this.debugRenderingContext.closePath();
        this.debugRenderingContext.stroke();
    }
    /**
     * Draws a point at the specified position
     * @param pos The position of the point
     * @param color The color of the point
     */
    static drawPoint(pos, color) {
        let pointSize = 6;
        this.debugRenderingContext.fillStyle = color.toString();
        this.debugRenderingContext.fillRect(pos.x - pointSize / 2, pos.y - pointSize / 2, pointSize, pointSize);
    }
    /**
     * Sets the default rendering color for text for the debugger
     * @param color The color to render the text
     */
    static setDefaultTextColor(color) {
        this.defaultTextColor = color;
    }
    /**
     * Performs any necessary setup operations on the Debug canvas
     * @param canvas The debug canvas
     * @param width The desired width of the canvas
     * @param height The desired height of the canvas
     * @returns The rendering context extracted from the canvas
     */
    static initializeDebugCanvas(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.debugCanvasSize = new Vec2_1.default(width, height);
        this.debugRenderingContext = canvas.getContext("2d");
        return this.debugRenderingContext;
    }
    /** Clears the debug canvas */
    static clearCanvas() {
        this.debugRenderingContext.clearRect(0, 0, this.debugCanvasSize.x, this.debugCanvasSize.y);
    }
    /** Renders the text and nodes sent to the Debug system */
    static render() {
        this.renderText();
        this.renderNodes();
    }
    /** Renders the text sent to the Debug canvas */
    static renderText() {
        let y = 20;
        this.debugRenderingContext.font = "20px Arial";
        this.debugRenderingContext.fillStyle = this.defaultTextColor.toString();
        // Draw all of the text
        this.logMessages.forEach((key) => {
            this.debugRenderingContext.fillText(this.logMessages.get(key), 10, y);
            y += 30;
        });
    }
    /** Renders the nodes registered with the debug canvas */
    static renderNodes() {
        if (this.nodes) {
            this.nodes.forEach(node => {
                node.debugRender();
            });
        }
    }
}
exports.default = Debug;
/** A map of log messages to display on the screen */
Debug.logMessages = new Map_1.default();
/** The rendering color for text */
Debug.defaultTextColor = Color_1.default.WHITE;
},{"../DataTypes/Map":8,"../DataTypes/Vec2":21,"../Utils/Color":97}],23:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("../Utils/Color"));
// @ignorePage
class Stats extends Object {
    static initStats() {
        let canvas = document.getElementById("stats-canvas");
        canvas.width = this.CANVAS_WIDTH;
        canvas.height = this.CANVAS_HEIGHT;
        this.ctx = canvas.getContext("2d");
        this.statsDiv = document.getElementById("stats-display");
        this.prevfps = new Array();
        this.prevClearTimes = new Array();
        this.SGClearTimes = new Array();
        this.avgSGClearTime = 0;
        this.prevFillTimes = new Array();
        this.SGFillTimes = new Array();
        this.avgSGFillTime = 0;
        this.prevUpdateTimes = new Array();
        this.SGUpdateTimes = new Array();
        this.avgSGUpdateTime = 0;
        this.prevQueryTimes = new Array();
        this.SGQueryTimes = new Array();
        this.avgSGQueryTime = 0;
        let clearTime = document.createElement("span");
        clearTime.setAttribute("id", "sgclear");
        let fillTime = document.createElement("span");
        fillTime.setAttribute("id", "sgfill");
        let updateTime = document.createElement("span");
        updateTime.setAttribute("id", "sgupdate");
        let queryTime = document.createElement("span");
        queryTime.setAttribute("id", "sgquery");
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        let br3 = document.createElement("br");
        this.statsDiv.append(clearTime, br1, fillTime, br2, updateTime, br3, queryTime);
        this.graphChoices = document.getElementById("chart-option");
        let option1 = document.createElement("option");
        option1.value = "prevfps";
        option1.label = "FPS";
        let option2 = document.createElement("option");
        option2.value = "prevClearTimes";
        option2.label = "Clear Time";
        let option3 = document.createElement("option");
        option3.value = "prevFillTimes";
        option3.label = "Fill time";
        let option4 = document.createElement("option");
        option4.value = "prevUpdateTimes";
        option4.label = "Update time";
        let option5 = document.createElement("option");
        option5.value = "prevQueryTimes";
        option5.label = "Query Time";
        let optionAll = document.createElement("option");
        optionAll.value = "all";
        optionAll.label = "All";
        this.graphChoices.append(option1, option2, option3, option4, option5, optionAll);
    }
    static updateFPS(fps) {
        this.prevfps.push(fps);
        if (this.prevfps.length > Stats.NUM_POINTS) {
            this.prevfps.shift();
        }
        if (this.SGClearTimes.length > 0) {
            this.prevClearTimes.push(this.avgSGClearTime);
            if (this.prevClearTimes.length > this.NUM_POINTS) {
                this.prevClearTimes.shift();
            }
        }
        if (this.SGFillTimes.length > 0) {
            this.prevFillTimes.push(this.avgSGFillTime);
            if (this.prevFillTimes.length > this.NUM_POINTS) {
                this.prevFillTimes.shift();
            }
        }
        if (this.SGUpdateTimes.length > 0) {
            this.prevUpdateTimes.push(this.avgSGUpdateTime);
            if (this.prevUpdateTimes.length > this.NUM_POINTS) {
                this.prevUpdateTimes.shift();
            }
        }
        if (this.SGQueryTimes.length > 0) {
            this.prevQueryTimes.push(this.avgSGQueryTime);
            if (this.prevQueryTimes.length > this.NUM_POINTS) {
                this.prevQueryTimes.shift();
            }
        }
        this.updateSGStats();
    }
    static log(key, data) {
        if (key === "sgclear") {
            this.SGClearTimes.push(data);
            if (this.SGClearTimes.length > 100) {
                this.SGClearTimes.shift();
            }
        }
        else if (key === "sgfill") {
            this.SGFillTimes.push(data);
            if (this.SGFillTimes.length > 100) {
                this.SGFillTimes.shift();
            }
        }
        else if (key === "sgupdate") {
            this.SGUpdateTimes.push(data);
            if (this.SGUpdateTimes.length > 100) {
                this.SGUpdateTimes.shift();
            }
        }
        else if (key === "sgquery") {
            this.SGQueryTimes.push(data);
            if (this.SGQueryTimes.length > 1000) {
                this.SGQueryTimes.shift();
            }
        }
    }
    static render() {
        // Display stats
        this.drawCharts();
    }
    static drawCharts() {
        this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        let paramString = this.graphChoices.value;
        if (paramString === "prevfps" || paramString === "all") {
            let param = this.prevfps;
            let color = Color_1.default.BLUE.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevClearTimes" || paramString === "all") {
            let param = this.prevClearTimes;
            let color = Color_1.default.RED.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevFillTimes" || paramString === "all") {
            let param = this.prevFillTimes;
            let color = Color_1.default.GREEN.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevUpdateTimes" || paramString === "all") {
            let param = this.prevUpdateTimes;
            let color = Color_1.default.CYAN.toString();
            this.drawChart(param, color);
        }
        if (paramString === "prevQueryTimes" || paramString === "all") {
            let param = this.prevQueryTimes;
            let color = Color_1.default.ORANGE.toString();
            this.drawChart(param, color);
        }
    }
    static drawChart(param, color) {
        this.ctx.strokeStyle = Color_1.default.BLACK.toString();
        this.ctx.beginPath();
        this.ctx.moveTo(10, 10);
        this.ctx.lineTo(10, this.CANVAS_HEIGHT - 10);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(10, this.CANVAS_HEIGHT - 10);
        this.ctx.lineTo(this.CANVAS_WIDTH - 10, this.CANVAS_HEIGHT - 10);
        this.ctx.closePath();
        this.ctx.stroke();
        let max = Math.max(...param);
        let prevX = 10;
        let prevY = this.CANVAS_HEIGHT - 10 - param[0] / max * (this.CANVAS_HEIGHT - 20);
        this.ctx.strokeStyle = color;
        for (let i = 1; i < param.length; i++) {
            let fps = param[i];
            let x = 10 + i * (this.CANVAS_WIDTH - 20) / this.NUM_POINTS;
            let y = this.CANVAS_HEIGHT - 10 - fps / max * (this.CANVAS_HEIGHT - 20);
            this.ctx.beginPath();
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            this.ctx.stroke();
            prevX = x;
            prevY = y;
        }
    }
    static updateSGStats() {
        if (this.SGClearTimes.length > 0) {
            this.avgSGClearTime = this.SGClearTimes.reduce((acc, val) => acc + val) / this.SGClearTimes.length;
        }
        if (this.SGFillTimes.length > 0) {
            this.avgSGFillTime = this.SGFillTimes.reduce((acc, val) => acc + val) / this.SGFillTimes.length;
        }
        if (this.SGUpdateTimes.length > 0) {
            this.avgSGUpdateTime = this.SGUpdateTimes.reduce((acc, val) => acc + val) / this.SGUpdateTimes.length;
        }
        if (this.SGQueryTimes.length > 0) {
            this.avgSGQueryTime = this.SGQueryTimes.reduce((acc, val) => acc + val) / this.SGQueryTimes.length;
        }
        document.getElementById("sgclear").innerHTML = "Avg SG clear time: " + this.avgSGClearTime;
        document.getElementById("sgfill").innerHTML = "Avg SG fill time: " + this.avgSGFillTime;
        document.getElementById("sgupdate").innerHTML = "Avg SG update time: " + this.avgSGUpdateTime;
        document.getElementById("sgquery").innerHTML = "Avg SG query time: " + this.avgSGQueryTime;
    }
}
exports.default = Stats;
Stats.NUM_POINTS = 60;
Stats.CANVAS_WIDTH = 300;
Stats.CANVAS_HEIGHT = 300;
},{"../Utils/Color":97}],24:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventQueue_1 = __importDefault(require("./EventQueue"));
const GameEvent_1 = __importDefault(require("./GameEvent"));
/**
 * An event emitter object other systems can use to hook into the EventQueue.
 * Provides an easy interface for firing off events.
 */
class Emitter {
    /** Creates a new Emitter */
    constructor() {
        this.eventQueue = EventQueue_1.default.getInstance();
    }
    /**
     * Emit and event of type eventType with the data packet data
     * @param eventType The name of the event to fire off
     * @param data A @reference[Map] or record containing any data about the event
     */
    fireEvent(eventType, data = null) {
        this.eventQueue.addEvent(new GameEvent_1.default(eventType, data));
    }
}
exports.default = Emitter;
},{"./EventQueue":25,"./GameEvent":26}],25:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = __importDefault(require("../DataTypes/Queue"));
const Map_1 = __importDefault(require("../DataTypes/Map"));
const GameEventType_1 = require("./GameEventType");
/**
 * The main event system of the game engine.
 * Events are sent to the EventQueue, which handles distribution to any systems that are listening for those events.
 * This allows for handling of input without having classes directly hook into javascript event handles,
 * and allows otherwise separate classes to communicate with each other cleanly, such as a Player object
 * requesting a sound be played by the audio system.
 *
 * The distribution of @reference[GameEvent]s happens as follows:
 *
 * Events are recieved throughout a frame and are queued up by the EventQueue.
 * At the beginning of the next frame, events are sent out to any receivers that are hooked into the event type.
 * @reference[Receiver]s are then free to process events as they see fit.
 *
 * Overall, the EventQueue can be considered as something similar to an email server,
 * and the @reference[Receiver]s can be considered as the client inboxes.
 *
 * See @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/event-queue.html) for more discussion on EventQueues
 */
class EventQueue {
    constructor() {
        this.MAX_SIZE = 1000;
        this.q = new Queue_1.default(this.MAX_SIZE);
        this.receivers = new Map_1.default();
    }
    /** Retrieves the instance of the Singleton EventQueue */
    static getInstance() {
        if (this.instance === null) {
            this.instance = new EventQueue();
        }
        return this.instance;
    }
    /** Adds an event to the EventQueue.
     * This is exposed to the rest of the game engine through the @reference[Emitter] class */
    addEvent(event) {
        this.q.enqueue(event);
    }
    /**
     * Associates a receiver with a type of event. Every time this event appears in the future,
     * it will be given to the receiver (and any others watching that type).
     * This is exposed to the rest of the game engine through the @reference[Receiver] class
     * @param receiver The event receiver
     * @param type The type or types of events to subscribe to
     */
    subscribe(receiver, type) {
        if (type instanceof Array) {
            // If it is an array, subscribe to all event types
            for (let t of type) {
                this.addListener(receiver, t);
            }
        }
        else {
            this.addListener(receiver, type);
        }
    }
    /**
     * Unsubscribes the specified receiver from all events, or from whatever events are provided
     * @param receiver The receiver to unsubscribe
     * @param keys The events to unsubscribe from. If none are provided, unsubscribe from all
     */
    unsubscribe(receiver, ...events) {
        this.receivers.forEach(eventName => {
            // If keys were provided, only continue if this key is one of them
            if (events.length > 0 && events.indexOf(eventName) === -1)
                return;
            // Find the index of our receiver for this key
            let index = this.receivers.get(eventName).indexOf(receiver);
            // If an index was found, remove the receiver
            if (index !== -1) {
                this.receivers.get(eventName).splice(index, 1);
            }
        });
    }
    // Associate the receiver and the type
    addListener(receiver, type) {
        if (this.receivers.has(type)) {
            this.receivers.get(type).push(receiver);
        }
        else {
            this.receivers.add(type, [receiver]);
        }
    }
    update(deltaT) {
        while (this.q.hasItems()) {
            // Retrieve each event
            let event = this.q.dequeue();
            // If a receiver has this event type, send it the event
            if (this.receivers.has(event.type)) {
                for (let receiver of this.receivers.get(event.type)) {
                    receiver.receive(event);
                }
            }
            // If a receiver is subscribed to all events, send it the event
            if (this.receivers.has(GameEventType_1.GameEventType.ALL)) {
                for (let receiver of this.receivers.get(GameEventType_1.GameEventType.ALL)) {
                    receiver.receive(event);
                }
            }
        }
    }
}
exports.default = EventQueue;
EventQueue.instance = null;
},{"../DataTypes/Map":8,"../DataTypes/Queue":12,"./GameEventType":27}],26:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
/**
 * A representation of an in-game event that is passed through the @reference[EventQueue]
 */
class GameEvent {
    /**
     * Creates a new GameEvent.
     * This is handled implicitly through the @reference[Emitter] class
     * @param type The type of the GameEvent
     * @param data The data contained by the GameEvent
     */
    constructor(type, data = null) {
        // Parse the game event data
        if (data === null) {
            this.data = new Map_1.default();
        }
        else if (!(data instanceof Map_1.default)) {
            // data is a raw object, unpack
            this.data = new Map_1.default();
            for (let key in data) {
                this.data.add(key, data[key]);
            }
        }
        else {
            this.data = data;
        }
        this.type = type;
        this.time = Date.now();
    }
    /**
     * Checks the type of the GameEvent
     * @param type The type to check
     * @returns True if the GameEvent is the specified type, false otherwise.
     */
    isType(type) {
        return this.type === type;
    }
    /**
     * Returns this GameEvent as a string
     * @returns The string representation of the GameEvent
     */
    toString() {
        return this.type + ": @" + this.time;
    }
}
exports.default = GameEvent;
},{"../DataTypes/Map":8}],27:[function(require,module,exports){
"use strict";
// @ignorePage
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventType = void 0;
var GameEventType;
(function (GameEventType) {
    /**
     * Mouse Down event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_DOWN"] = "mouse_down";
    /**
     * Mouse Up event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_UP"] = "mouse_up";
    /**
     * Mouse Move event. Has data: {position: Vec2 - Mouse Position}
     */
    GameEventType["MOUSE_MOVE"] = "mouse_move";
    /**
     * Key Down event. Has data: {key: string - The key that is down}
     */
    GameEventType["KEY_DOWN"] = "key_down";
    /**
     * Key Up event. Has data: {key: string - The key that is up}
     */
    GameEventType["KEY_UP"] = "key_up";
    /**
     * Canvas Blur event. Has data: {}
     */
    GameEventType["CANVAS_BLUR"] = "canvas_blur";
    /**
     * Mouse wheel up event. Has data: {}
     */
    GameEventType["WHEEL_UP"] = "wheel_up";
    /**
     * Mouse wheel down event. Has data: {}
     */
    GameEventType["WHEEL_DOWN"] = "wheel_down";
    /**
     * Start Recording event. Has data: {}
     */
    GameEventType["START_RECORDING"] = "start_recording";
    /**
     * Stop Recording event. Has data: {}
     */
    GameEventType["STOP_RECORDING"] = "stop_recording";
    /**
     * Play Recording event. Has data: {}
     */
    GameEventType["PLAY_RECORDING"] = "play_recording";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
     */
    GameEventType["PLAY_SOUND"] = "play_sound";
    /**
     * Play Sound event. Has data: {key: string}
     */
    GameEventType["STOP_SOUND"] = "stop_sound";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean, channel: AudioChannelType }
     */
    GameEventType["PLAY_SFX"] = "play_sfx";
    /**
     * Play Sound event. Has data: {key: string, loop: boolean, holdReference: boolean }
     */
    GameEventType["PLAY_MUSIC"] = "play_music";
    /**
     * Mute audio channel event. Has data: {channel: AudioChannelType}
     */
    GameEventType["MUTE_CHANNEL"] = "mute_channel";
    /**
     * Unmute audio channel event. Has data: {channel: AudioChannelType}
     */
    GameEventType["UNMUTE_CHANNEL"] = "unmute_channel";
    /**
     * Encompasses all event types. Used for receivers only.
     */
    GameEventType["ALL"] = "all";
})(GameEventType = exports.GameEventType || (exports.GameEventType = {}));
},{}],28:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = __importDefault(require("../DataTypes/Queue"));
const EventQueue_1 = __importDefault(require("./EventQueue"));
/**
 * Receives subscribed events from the EventQueue.
 */
class Receiver {
    /** Creates a new Receiver */
    constructor() {
        this.MAX_SIZE = 1000;
        this.q = new Queue_1.default(this.MAX_SIZE);
    }
    destroy() {
        EventQueue_1.default.getInstance().unsubscribe(this);
    }
    /**
     * Adds these types of events to this receiver's queue every update.
     * @param eventTypes The types of events this receiver will be subscribed to
     */
    subscribe(eventTypes) {
        EventQueue_1.default.getInstance().subscribe(this, eventTypes);
        this.q.clear();
    }
    /**
     * Adds an event to the queue of this reciever. This is used by the @reference[EventQueue] to distribute events
     * @param event The event to receive
     */
    receive(event) {
        try {
            this.q.enqueue(event);
        }
        catch (e) {
            console.warn("Receiver overflow for event " + event.toString());
            throw e;
        }
    }
    /**
     * Retrieves the next event from the receiver's queue
     * @returns The next GameEvent
     */
    getNextEvent() {
        return this.q.dequeue();
    }
    /**
     * Looks at the next event in the receiver's queue, but doesn't remove it from the queue
     * @returns The next GameEvent
     */
    peekNextEvent() {
        return this.q.peekNext();
    }
    /**
     * Returns true if the receiver has any events in its queue
     * @returns True if the receiver has another event, false otherwise
     */
    hasNextEvent() {
        return this.q.hasItems();
    }
    /**
     * Ignore all events this frame
     */
    ignoreEvents() {
        this.q.clear();
    }
}
exports.default = Receiver;
},{"../DataTypes/Queue":12,"./EventQueue":25}],29:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const Map_1 = __importDefault(require("../DataTypes/Map"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const EventQueue_1 = __importDefault(require("../Events/EventQueue"));
const GameEventType_1 = require("../Events/GameEventType");
/**
 * Receives input events from the @reference[EventQueue] and allows for easy access of information about input by other systems
 */
class Input {
    /**
     * Initializes the Input object
     * @param viewport A reference to the viewport of the game
     */
    static initialize(viewport, keyMap) {
        Input.viewport = viewport;
        Input.mousePressed = false;
        Input.mouseJustPressed = false;
        Input.receiver = new Receiver_1.default();
        Input.keyJustPressed = new Map_1.default();
        Input.keyPressed = new Map_1.default();
        Input.mousePosition = new Vec2_1.default(0, 0);
        Input.mousePressPosition = new Vec2_1.default(0, 0);
        Input.scrollDirection = 0;
        Input.justScrolled = false;
        Input.keysDisabled = false;
        Input.mouseDisabled = false;
        // Initialize the keymap
        Input.keyMap = new Map_1.default();
        // Add all keys to the keymap
        for (let entry in keyMap) {
            let name = keyMap[entry].name;
            let keys = keyMap[entry].keys;
            Input.keyMap.add(name, keys);
        }
        Input.eventQueue = EventQueue_1.default.getInstance();
        // Subscribe to all input events
        Input.eventQueue.subscribe(Input.receiver, [GameEventType_1.GameEventType.MOUSE_DOWN, GameEventType_1.GameEventType.MOUSE_UP, GameEventType_1.GameEventType.MOUSE_MOVE,
            GameEventType_1.GameEventType.KEY_DOWN, GameEventType_1.GameEventType.KEY_UP, GameEventType_1.GameEventType.CANVAS_BLUR, GameEventType_1.GameEventType.WHEEL_UP, GameEventType_1.GameEventType.WHEEL_DOWN]);
    }
    static update(deltaT) {
        // Reset the justPressed values to false
        Input.mouseJustPressed = false;
        Input.keyJustPressed.forEach((key) => Input.keyJustPressed.set(key, false));
        Input.justScrolled = false;
        Input.scrollDirection = 0;
        while (Input.receiver.hasNextEvent()) {
            let event = Input.receiver.getNextEvent();
            // Handle each event type
            if (event.type === GameEventType_1.GameEventType.MOUSE_DOWN) {
                Input.mouseJustPressed = true;
                Input.mousePressed = true;
                Input.mousePressPosition = event.data.get("position");
                Input.mouseButtonPressed = event.data.get("button");
            }
            if (event.type === GameEventType_1.GameEventType.MOUSE_UP) {
                Input.mousePressed = false;
            }
            if (event.type === GameEventType_1.GameEventType.MOUSE_MOVE) {
                Input.mousePosition = event.data.get("position");
            }
            if (event.type === GameEventType_1.GameEventType.KEY_DOWN) {
                let key = event.data.get("key");
                // Handle space bar
                if (key === " ") {
                    key = "space";
                }
                if (!Input.keyPressed.get(key)) {
                    Input.keyJustPressed.set(key, true);
                    Input.keyPressed.set(key, true);
                }
            }
            if (event.type === GameEventType_1.GameEventType.KEY_UP) {
                let key = event.data.get("key");
                // Handle space bar
                if (key === " ") {
                    key = "space";
                }
                Input.keyPressed.set(key, false);
            }
            if (event.type === GameEventType_1.GameEventType.CANVAS_BLUR) {
                Input.clearKeyPresses();
            }
            if (event.type === GameEventType_1.GameEventType.WHEEL_UP) {
                Input.scrollDirection = -1;
                Input.justScrolled = true;
            }
            else if (event.type === GameEventType_1.GameEventType.WHEEL_DOWN) {
                Input.scrollDirection = 1;
                Input.justScrolled = true;
            }
        }
    }
    static clearKeyPresses() {
        Input.keyJustPressed.forEach((key) => Input.keyJustPressed.set(key, false));
        Input.keyPressed.forEach((key) => Input.keyPressed.set(key, false));
    }
    /**
     * Returns whether or not a key was newly pressed Input frame.
     * If the key is still pressed from last frame and wasn't re-pressed, Input will return false.
     * @param key The key
     * @returns True if the key was just pressed, false otherwise
     */
    static isKeyJustPressed(key) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyJustPressed.has(key)) {
            return Input.keyJustPressed.get(key);
        }
        else {
            return false;
        }
    }
    /**
     * Returns an array of all of the keys that are newly pressed Input frame.
     * If a key is still pressed from last frame and wasn't re-pressed, it will not be in Input list.
     * @returns An array of all of the newly pressed keys.
     */
    static getKeysJustPressed() {
        if (Input.keysDisabled)
            return [];
        let keys = Array();
        Input.keyJustPressed.forEach(key => {
            if (Input.keyJustPressed.get(key)) {
                keys.push(key);
            }
        });
        return keys;
    }
    /**
     * Returns whether or not a key is being pressed.
     * @param key The key
     * @returns True if the key is currently pressed, false otherwise
     */
    static isKeyPressed(key) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyPressed.has(key)) {
            return Input.keyPressed.get(key);
        }
        else {
            return false;
        }
    }
    /**
     * Changes the binding of an input name to keys
     * @param inputName The name of the input
     * @param keys The corresponding keys
     */
    static changeKeyBinding(inputName, keys) {
        Input.keyMap.set(inputName, keys);
    }
    /**
     * Clears all key bindings
     */
    static clearAllKeyBindings() {
        Input.keyMap.clear();
    }
    /**
     * Returns whether or not an input was just pressed this frame
     * @param inputName The name of the input
     * @returns True if the input was just pressed, false otherwise
     */
    static isJustPressed(inputName) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyMap.has(inputName)) {
            const keys = Input.keyMap.get(inputName);
            let justPressed = false;
            for (let key of keys) {
                justPressed = justPressed || Input.isKeyJustPressed(key);
            }
            return justPressed;
        }
        else {
            return false;
        }
    }
    /**
     * Returns whether or not an input is currently pressed
     * @param inputName The name of the input
     * @returns True if the input is pressed, false otherwise
     */
    static isPressed(inputName) {
        if (Input.keysDisabled)
            return false;
        if (Input.keyMap.has(inputName)) {
            const keys = Input.keyMap.get(inputName);
            let pressed = false;
            for (let key of keys) {
                pressed = pressed || Input.isKeyPressed(key);
            }
            return pressed;
        }
        else {
            return false;
        }
    }
    /**
     *
     * Returns whether or not the mouse was newly pressed Input frame.
     * @param mouseButton Optionally specify which mouse click you want to know was pressed.
     * 0 for left click, 1 for middle click, 2 for right click.
     * @returns True if the mouse was just pressed, false otherwise
     */
    static isMouseJustPressed(mouseButton) {
        if (mouseButton) {
            return Input.mouseJustPressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
        }
        return Input.mouseJustPressed && !Input.mouseDisabled;
    }
    /**
     * Returns whether or not the mouse is currently pressed
     * @param mouseButton Optionally specify which mouse click you want to know was pressed.
     * 0 for left click, 1 for middle click, 2 for right click.
     * @returns True if the mouse is currently pressed, false otherwise
     */
    static isMousePressed(mouseButton) {
        if (mouseButton) {
            return Input.mousePressed && !Input.mouseDisabled && mouseButton == this.mouseButtonPressed;
        }
        return Input.mousePressed && !Input.mouseDisabled;
    }
    /**
     * Returns whether the user scrolled or not
     * @returns True if the user just scrolled Input frame, false otherwise
     */
    static didJustScroll() {
        return Input.justScrolled && !Input.mouseDisabled;
    }
    /**
     * Gets the direction of the scroll
     * @returns -1 if the user scrolled up, 1 if they scrolled down
     */
    static getScrollDirection() {
        return Input.scrollDirection;
    }
    /**
     * Gets the position of the player's mouse
     * @returns The mouse position stored as a Vec2
     */
    static getMousePosition() {
        return Input.mousePosition.scaled(1 / this.viewport.getZoomLevel());
    }
    /**
     * Gets the position of the player's mouse in the game world,
     * taking into consideration the scrolling of the viewport
     * @returns The mouse position stored as a Vec2
     */
    static getGlobalMousePosition() {
        return Input.mousePosition.clone().scale(1 / this.viewport.getZoomLevel()).add(Input.viewport.getOrigin());
    }
    /**
     * Gets the position of the last mouse press
     * @returns The mouse position stored as a Vec2
     */
    static getMousePressPosition() {
        return Input.mousePressPosition.scaled(1 / this.viewport.getZoomLevel());
    }
    /**
     * Gets the position of the last mouse press in the game world,
     * taking into consideration the scrolling of the viewport
     * @returns The mouse position stored as a Vec2
     */
    static getGlobalMousePressPosition() {
        return Input.mousePressPosition.clone().add(Input.viewport.getOrigin());
    }
    /**
     * Disables all keypress and mouse click inputs
     */
    static disableInput() {
        Input.keysDisabled = true;
        Input.mouseDisabled = true;
    }
    /**
     * Enables all keypress and mouse click inputs
     */
    static enableInput() {
        Input.keysDisabled = false;
        Input.mouseDisabled = false;
    }
}
exports.default = Input;
},{"../DataTypes/Map":8,"../DataTypes/Vec2":21,"../Events/EventQueue":25,"../Events/GameEventType":27,"../Events/Receiver":28}],30:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventQueue_1 = __importDefault(require("../Events/EventQueue"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const GameEvent_1 = __importDefault(require("../Events/GameEvent"));
const GameEventType_1 = require("../Events/GameEventType");
/**
 * Handles communication with the web browser to receive asynchronous events and send them to the @reference[EventQueue]
 */
class InputHandler {
    /**
     * Creates a new InputHandler
     * @param canvas The game canvas
     */
    constructor(canvas) {
        this.handleMouseDown = (event, canvas) => {
            let pos = this.getMousePosition(event, canvas);
            let button = event.button;
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.MOUSE_DOWN, { position: pos, button: button });
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleMouseUp = (event, canvas) => {
            let pos = this.getMousePosition(event, canvas);
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.MOUSE_UP, { position: pos });
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleMouseMove = (event, canvas) => {
            let pos = this.getMousePosition(event, canvas);
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.MOUSE_MOVE, { position: pos });
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleKeyDown = (event) => {
            let key = this.getKey(event);
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.KEY_DOWN, { key: key });
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleKeyUp = (event) => {
            let key = this.getKey(event);
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.KEY_UP, { key: key });
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleBlur = (event) => {
            let gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.CANVAS_BLUR, {});
            this.eventQueue.addEvent(gameEvent);
        };
        this.handleContextMenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };
        this.handleWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
            let gameEvent;
            if (event.deltaY < 0) {
                gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.WHEEL_UP, {});
            }
            else {
                gameEvent = new GameEvent_1.default(GameEventType_1.GameEventType.WHEEL_DOWN, {});
            }
            this.eventQueue.addEvent(gameEvent);
        };
        this.eventQueue = EventQueue_1.default.getInstance();
        canvas.onmousedown = (event) => this.handleMouseDown(event, canvas);
        canvas.onmouseup = (event) => this.handleMouseUp(event, canvas);
        canvas.oncontextmenu = this.handleContextMenu;
        canvas.onmousemove = (event) => this.handleMouseMove(event, canvas);
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        document.onblur = this.handleBlur;
        document.oncontextmenu = this.handleBlur;
        document.onwheel = this.handleWheel;
    }
    getKey(keyEvent) {
        return keyEvent.key.toLowerCase();
    }
    getMousePosition(mouseEvent, canvas) {
        let rect = canvas.getBoundingClientRect();
        let x = mouseEvent.clientX - rect.left;
        let y = mouseEvent.clientY - rect.top;
        return new Vec2_1.default(x, y);
    }
}
exports.default = InputHandler;
},{"../DataTypes/Vec2":21,"../Events/EventQueue":25,"../Events/GameEvent":26,"../Events/GameEventType":27}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignorePage
/**
 * Sets up the environment of the game engine
 */
class EnvironmentInitializer {
    static setup() {
        CanvasRenderingContext2D.prototype.roundedRect = function (x, y, w, h, r) {
            // Clamp the radius between 0 and the min of the width or height
            if (r < 0)
                r = 0;
            if (r > Math.min(w, h))
                r = Math.min(w, h);
            // Draw the rounded rect
            this.beginPath();
            // Top
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.arcTo(x + w, y, x + w, y + r, r);
            // Right
            this.lineTo(x + w, y + h - r);
            this.arcTo(x + w, y + h, x + w - r, y + h, r);
            // Bottom
            this.lineTo(x + r, y + h);
            this.arcTo(x, y + h, x, y + h - r, r);
            // Left
            this.lineTo(x, y + r);
            this.arcTo(x, y, x + r, y, r);
            this.closePath();
        };
        CanvasRenderingContext2D.prototype.strokeRoundedRect = function (x, y, w, h, r) {
            this.roundedRect(x, y, w, h, r);
            this.stroke();
        };
        CanvasRenderingContext2D.prototype.fillRoundedRect = function (x, y, w, h, r) {
            this.roundedRect(x, y, w, h, r);
            this.fill();
        };
    }
}
exports.default = EnvironmentInitializer;
},{}],32:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameLoop_1 = __importDefault(require("./GameLoop"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
const Stats_1 = __importDefault(require("../Debug/Stats"));
/**
 * A game loop with a fixed update time and a variable render time.
 * Every frame, the game updates until all time since the last frame has been processed.
 * If too much time has passed, such as if the last update was too slow,
 * or if the browser was put into the background, the loop will panic and discard time.
 * A render happens at the end of every frame. This happens as fast as possible unless specified.
 * A loop of this type allows for deterministic behavior - No matter what the frame rate is, the update should behave the same,
 * as it is occuring in a fixed interval.
 */
class FixedUpdateGameLoop extends GameLoop_1.default {
    constructor() {
        super();
        /**
         * The main loop of the game. Updates until the current time is reached. Renders once
         * @param timestamp The current time in ms
         */
        this.doFrame = (timestamp) => {
            // If a pause was executed, stop doing the loop.
            if (this.paused) {
                return;
            }
            // Request animation frame to prepare for another update or render
            window.requestAnimationFrame((t) => this.doFrame(t));
            // If we are trying to render too soon, do nothing.
            if (timestamp < this.lastFrameTime + this.minFrameDelay) {
                return;
            }
            // A frame is actually happening
            this.startFrame(timestamp);
            // Update while there is still time to make up. If we do too many update steps, panic and exit the loop.
            this.numUpdateSteps = 0;
            let panic = false;
            while (this.frameDelta >= this.updateTimestep) {
                // Do an update
                this._doUpdate(this.updateTimestep / 1000);
                // Remove the update step time from the time we have to process
                this.frameDelta -= this.updateTimestep;
                // Increment steps and check if we've done too many
                this.numUpdateSteps++;
                if (this.numUpdateSteps > 100) {
                    panic = true;
                    break;
                }
            }
            // Updates are done, render
            this._doRender();
            // Wrap up the frame
            this.finishFrame(panic);
        };
        this.maxUpdateFPS = 60;
        this.updateTimestep = Math.floor(1000 / this.maxUpdateFPS);
        this.frameDelta = 0;
        this.lastFrameTime = 0;
        this.minFrameDelay = 0;
        this.frame = 0;
        this.fps = this.maxUpdateFPS; // Initialize the fps to the max allowed fps
        this.fpsUpdateInterval = 1000;
        this.lastFpsUpdate = 0;
        this.framesSinceLastFpsUpdate = 0;
        this.started = false;
        this.paused = false;
        this.running = false;
        this.numUpdateSteps = 0;
    }
    getFPS() {
        return 0;
    }
    /**
     * Updates the frame count and sum of time for the framerate of the game
     * @param timestep The current time in ms
     */
    updateFPS(timestamp) {
        this.fps = 0.9 * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) + (1 - 0.9) * this.fps;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        Debug_1.default.log("fps", "FPS: " + this.fps.toFixed(1));
        Stats_1.default.updateFPS(this.fps);
    }
    /**
 * Changes the maximum allowed physics framerate of the game
 * @param initMax The max framerate
 */
    setMaxUpdateFPS(initMax) {
        this.maxUpdateFPS = initMax;
        this.updateTimestep = Math.floor(1000 / this.maxUpdateFPS);
    }
    /**
     * Sets the maximum rendering framerate
     * @param maxFPS The max framerate
     */
    setMaxFPS(maxFPS) {
        this.minFrameDelay = 1000 / maxFPS;
    }
    /**
     * This function is called when the game loop panics, i.e. it tries to process too much time in an entire frame.
     * This will reset the amount of time back to zero.
     * @returns The amount of time we are discarding from processing.
     */
    resetFrameDelta() {
        let oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }
    /**
     * Starts up the game loop and calls the first requestAnimationFrame
     */
    start() {
        if (!this.started) {
            this.started = true;
            window.requestAnimationFrame((timestamp) => this.doFirstFrame(timestamp));
        }
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
    /**
     * The first game frame - initializes the first frame time and begins the render
     * @param timestamp The current time in ms
     */
    doFirstFrame(timestamp) {
        this.running = true;
        this._doRender();
        this.lastFrameTime = timestamp;
        this.lastFpsUpdate = timestamp;
        this.framesSinceLastFpsUpdate = 0;
        window.requestAnimationFrame((t) => this.doFrame(t));
    }
    /**
     * Handles any processing that needs to be done at the start of the frame
     * @param timestamp The time of the frame in ms
     */
    startFrame(timestamp) {
        // Update the amount of time we need our update to process
        this.frameDelta += timestamp - this.lastFrameTime;
        // Set the new time of the last frame
        this.lastFrameTime = timestamp;
        // Update the estimate of the framerate
        if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
            this.updateFPS(timestamp);
        }
        // Increment the number of frames
        this.frame++;
        this.framesSinceLastFpsUpdate++;
    }
    /**
     * Wraps up the frame and handles the panic state if there is one
     * @param panic Whether or not the loop panicked
     */
    finishFrame(panic) {
        if (panic) {
            var discardedTime = Math.round(this.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    }
}
exports.default = FixedUpdateGameLoop;
},{"../Debug/Debug":22,"../Debug/Stats":23,"./GameLoop":34}],33:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EventQueue_1 = __importDefault(require("../Events/EventQueue"));
const Input_1 = __importDefault(require("../Input/Input"));
const InputHandler_1 = __importDefault(require("../Input/InputHandler"));
const Recorder_1 = __importDefault(require("../Playback/Recorder"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
const Viewport_1 = __importDefault(require("../SceneGraph/Viewport"));
const SceneManager_1 = __importDefault(require("../Scene/SceneManager"));
const AudioManager_1 = __importDefault(require("../Sound/AudioManager"));
const Stats_1 = __importDefault(require("../Debug/Stats"));
const CanvasRenderer_1 = __importDefault(require("../Rendering/CanvasRenderer"));
const Color_1 = __importDefault(require("../Utils/Color"));
const GameOptions_1 = __importDefault(require("./GameOptions"));
const FixedUpdateGameLoop_1 = __importDefault(require("./FixedUpdateGameLoop"));
const EnvironmentInitializer_1 = __importDefault(require("./EnvironmentInitializer"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const RegistryManager_1 = __importDefault(require("../Registry/RegistryManager"));
const WebGLRenderer_1 = __importDefault(require("../Rendering/WebGLRenderer"));
/**
 * The main loop of the game engine.
 * Handles the update order, and initializes all subsystems.
 * The Game manages the update cycle, and requests animation frames to render to the browser.
 */
class Game {
    /**
     * Creates a new Game
     * @param options The options for Game initialization
     */
    constructor(options) {
        // Before anything else, build the environment
        EnvironmentInitializer_1.default.setup();
        // Typecast the config object to a GameConfig object
        this.gameOptions = GameOptions_1.default.parse(options);
        this.showDebug = this.gameOptions.showDebug;
        this.showStats = this.gameOptions.showStats;
        // Create an instance of a game loop
        this.loop = new FixedUpdateGameLoop_1.default();
        // Get the game canvas and give it a background color
        this.GAME_CANVAS = document.getElementById("game-canvas");
        this.DEBUG_CANVAS = document.getElementById("debug-canvas");
        // Give the canvas a size and get the rendering context
        this.WIDTH = this.gameOptions.canvasSize.x;
        this.HEIGHT = this.gameOptions.canvasSize.y;
        // This step MUST happen before the resource manager does anything
        if (this.gameOptions.useWebGL) {
            this.renderingManager = new WebGLRenderer_1.default();
        }
        else {
            this.renderingManager = new CanvasRenderer_1.default();
        }
        this.initializeGameWindow();
        this.ctx = this.renderingManager.initializeCanvas(this.GAME_CANVAS, this.WIDTH, this.HEIGHT);
        this.clearColor = new Color_1.default(this.gameOptions.clearColor.r, this.gameOptions.clearColor.g, this.gameOptions.clearColor.b);
        // Initialize debugging and stats
        Debug_1.default.initializeDebugCanvas(this.DEBUG_CANVAS, this.WIDTH, this.HEIGHT);
        Stats_1.default.initStats();
        if (this.gameOptions.showStats) {
            // Find the stats output and make it no longer hidden
            document.getElementById("stats").hidden = false;
        }
        // Size the viewport to the game canvas
        const canvasSize = new Vec2_1.default(this.WIDTH, this.HEIGHT);
        this.viewport = new Viewport_1.default(canvasSize, this.gameOptions.zoomLevel);
        // Initialize all necessary game subsystems
        this.eventQueue = EventQueue_1.default.getInstance();
        this.inputHandler = new InputHandler_1.default(this.GAME_CANVAS);
        Input_1.default.initialize(this.viewport, this.gameOptions.inputs);
        this.recorder = new Recorder_1.default();
        this.resourceManager = ResourceManager_1.default.getInstance();
        this.sceneManager = new SceneManager_1.default(this.viewport, this.renderingManager);
        this.audioManager = AudioManager_1.default.getInstance();
    }
    /**
     * Set up the game window that holds the canvases
     */
    initializeGameWindow() {
        const gameWindow = document.getElementById("game-window");
        // Set the height of the game window
        gameWindow.style.width = this.WIDTH + "px";
        gameWindow.style.height = this.HEIGHT + "px";
    }
    /**
     * Retreives the SceneManager from the Game
     * @returns The SceneManager
     */
    getSceneManager() {
        return this.sceneManager;
    }
    /**
     * Starts the game
     */
    start(InitialScene, options) {
        // Set the update function of the loop
        this.loop.doUpdate = (deltaT) => this.update(deltaT);
        // Set the render function of the loop
        this.loop.doRender = () => this.render();
        // Preload registry items
        RegistryManager_1.default.preload();
        // Load the items with the resource manager
        this.resourceManager.loadResourcesFromQueue(() => {
            // When we're done loading, start the loop
            console.log("Finished Preload - loading first scene");
            this.sceneManager.changeToScene(InitialScene, {}, options);
            this.loop.start();
        });
    }
    /**
     * Updates all necessary subsystems of the game. Defers scene updates to the sceneManager
     * @param deltaT The time sine the last update
     */
    update(deltaT) {
        try {
            // Handle all events that happened since the start of the last loop
            this.eventQueue.update(deltaT);
            // Update the input data structures so game objects can see the input
            Input_1.default.update(deltaT);
            // Update the recording of the game
            this.recorder.update(deltaT);
            // Update all scenes
            this.sceneManager.update(deltaT);
            // Update all sounds
            this.audioManager.update(deltaT);
            // Load or unload any resources if needed
            this.resourceManager.update(deltaT);
        }
        catch (e) {
            this.loop.pause();
            console.warn("Uncaught Error in Update - Crashing gracefully");
            console.error(e);
        }
    }
    /**
     * Clears the canvas and defers scene rendering to the sceneManager. Renders the debug canvas
     */
    render() {
        try {
            // Clear the canvases
            Debug_1.default.clearCanvas();
            this.renderingManager.clear(this.clearColor);
            this.sceneManager.render();
            // Hacky debug mode
            if (Input_1.default.isKeyJustPressed("g")) {
                this.showDebug = !this.showDebug;
            }
            // Debug render
            if (this.showDebug) {
                Debug_1.default.render();
            }
            if (this.showStats) {
                Stats_1.default.render();
            }
        }
        catch (e) {
            this.loop.pause();
            console.warn("Uncaught Error in Render - Crashing gracefully");
            console.error(e);
        }
    }
}
exports.default = Game;
},{"../DataTypes/Vec2":21,"../Debug/Debug":22,"../Debug/Stats":23,"../Events/EventQueue":25,"../Input/Input":29,"../Input/InputHandler":30,"../Playback/Recorder":59,"../Registry/RegistryManager":62,"../Rendering/CanvasRenderer":69,"../Rendering/WebGLRenderer":74,"../ResourceManager/ResourceManager":81,"../Scene/SceneManager":92,"../SceneGraph/Viewport":84,"../Sound/AudioManager":94,"../Utils/Color":97,"./EnvironmentInitializer":31,"./FixedUpdateGameLoop":32,"./GameOptions":35}],34:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NullFunc_1 = __importDefault(require("../DataTypes/Functions/NullFunc"));
/**
 * The main game loop of the game. Keeps track of fps and handles scheduling of updates and rendering.
 * This class is left abstract, so that a subclass can handle exactly how the loop is scheduled.
 * For an example of different types of game loop scheduling, check out @link(Game Programming Patterns)(https://gameprogrammingpatterns.com/game-loop.html)
 */
class GameLoop {
    constructor() {
        /** The function to call when an update occurs */
        this._doUpdate = NullFunc_1.default;
        /** The function to call when a render occurs */
        this._doRender = NullFunc_1.default;
    }
    set doUpdate(update) {
        this._doUpdate = update;
    }
    set doRender(render) {
        this._doRender = render;
    }
}
exports.default = GameLoop;
},{"../DataTypes/Functions/NullFunc":3}],35:[function(require,module,exports){
"use strict";
// @ignorePage
Object.defineProperty(exports, "__esModule", { value: true });
/** The options for initializing the @reference[GameLoop] */
class GameOptions {
    /**
     * Parses the data in the raw options object
     * @param options The game options as a Record
     * @returns A version of the options converted to a GameOptions object
     */
    static parse(options) {
        let gOpt = new GameOptions();
        gOpt.canvasSize = options.canvasSize ? options.canvasSize : { x: 800, y: 600 };
        gOpt.zoomLevel = options.zoomLevel ? options.zoomLevel : 1;
        gOpt.clearColor = options.clearColor ? options.clearColor : { r: 255, g: 255, b: 255 };
        gOpt.inputs = options.inputs ? options.inputs : [];
        gOpt.showDebug = !!options.showDebug;
        gOpt.showStats = !!options.showStats;
        gOpt.useWebGL = !!options.useWebGL;
        return gOpt;
    }
}
exports.default = GameOptions;
},{}],36:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameNode_1 = __importDefault(require("./GameNode"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const AABB_1 = __importDefault(require("../DataTypes/Shapes/AABB"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
const Color_1 = __importDefault(require("../Utils/Color"));
/**
 * The representation of an object in the game world that can be drawn to the screen
 */
class CanvasNode extends GameNode_1.default {
    constructor() {
        super();
        /** A flag for whether or not the CanvasNode is visible */
        this.visible = true;
        this._size = new Vec2_1.default(0, 0);
        this._size.setOnChange(() => this.sizeChanged());
        this._scale = new Vec2_1.default(1, 1);
        this._scale.setOnChange(() => this.scaleChanged());
        this._boundary = new AABB_1.default();
        this.updateBoundary();
        this._hasCustomShader = false;
    }
    get alpha() {
        return this._alpha;
    }
    set alpha(a) {
        this._alpha = a;
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size = size;
        // Enter as a lambda to bind "this"
        this._size.setOnChange(() => this.sizeChanged());
        this.sizeChanged();
    }
    get scale() {
        return this._scale;
    }
    set scale(scale) {
        this._scale = scale;
        // Enter as a lambda to bind "this"
        this._scale.setOnChange(() => this.scaleChanged());
        this.scaleChanged();
    }
    set scaleX(value) {
        this.scale.x = value;
    }
    set scaleY(value) {
        this.scale.y = value;
    }
    get hasCustomShader() {
        return this._hasCustomShader;
    }
    get customShaderKey() {
        return this._customShaderKey;
    }
    // @override
    positionChanged() {
        super.positionChanged();
        this.updateBoundary();
    }
    /** Called if the size vector is changed or replaced. */
    sizeChanged() {
        this.updateBoundary();
    }
    /** Called if the scale vector is changed or replaced */
    scaleChanged() {
        this.updateBoundary();
    }
    // @docIgnore
    /** Called if the position, size, or scale of the CanvasNode is changed. Updates the boundary. */
    updateBoundary() {
        this._boundary.center.set(this.position.x, this.position.y);
        this._boundary.halfSize.set(this.size.x * this.scale.x / 2, this.size.y * this.scale.y / 2);
    }
    get boundary() {
        return this._boundary;
    }
    get sizeWithZoom() {
        let zoom = this.scene.getViewScale();
        return this.boundary.halfSize.clone().scaled(zoom, zoom);
    }
    /**
     * Adds a custom shader to this CanvasNode
     * @param key The registry key of the ShaderType
     */
    useCustomShader(key) {
        this._hasCustomShader = true;
        this._customShaderKey = key;
    }
    /**
     * Returns true if the point (x, y) is inside of this canvas object
     * @param x The x position of the point
     * @param y The y position of the point
     * @returns A flag representing whether or not this node contains the point.
     */
    contains(x, y) {
        return this._boundary.containsPoint(new Vec2_1.default(x, y));
    }
    // @implemented
    debugRender() {
        Debug_1.default.drawBox(this.relativePosition, this.sizeWithZoom, false, Color_1.default.BLUE);
        super.debugRender();
    }
}
exports.default = CanvasNode;
},{"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":21,"../Debug/Debug":22,"../Utils/Color":97,"./GameNode":37}],37:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweenableProperties = void 0;
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const Emitter_1 = __importDefault(require("../Events/Emitter"));
const Region_1 = require("../DataTypes/Interfaces/Region");
const AABB_1 = __importDefault(require("../DataTypes/Shapes/AABB"));
const TweenController_1 = __importDefault(require("../Rendering/Animations/TweenController"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
const Color_1 = __importDefault(require("../Utils/Color"));
const Circle_1 = __importDefault(require("../DataTypes/Shapes/Circle"));
/**
 * The representation of an object in the game world.
 * To construct GameNodes, see the @reference[Scene] documentation.
 */
class GameNode {
    // Constructor docs are ignored, as the user should NOT create new GameNodes with a raw constructor
    constructor() {
        /*---------- PHYSICAL ----------*/
        this.hasPhysics = false;
        this.moving = false;
        this.frozen = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = false;
        this.isColliding = false;
        this.pathfinding = false;
        this._position = new Vec2_1.default(0, 0);
        this._position.setOnChange(() => this.positionChanged());
        this.receiver = new Receiver_1.default();
        this.emitter = new Emitter_1.default();
        this.tweens = new TweenController_1.default(this);
        this.rotation = 0;
    }
    destroy() {
        this.tweens.destroy();
        this.receiver.destroy();
        if (this.hasPhysics) {
            this.removePhysics();
        }
        if (this._ai) {
            this._ai.destroy();
            delete this._ai;
            this.scene.getAIManager().removeActor(this);
        }
        this.scene.remove(this);
        this.layer.removeNode(this);
    }
    /*---------- POSITIONED ----------*/
    get position() {
        return this._position;
    }
    set position(pos) {
        this._position = pos;
        this._position.setOnChange(() => this.positionChanged());
        this.positionChanged();
    }
    get relativePosition() {
        return this.inRelativeCoordinates(this.position);
    }
    /**
     * Converts a point to coordinates relative to the zoom and origin of this node
     * @param point The point to conver
     * @returns A new Vec2 representing the point in relative coordinates
     */
    inRelativeCoordinates(point) {
        let origin = this.scene.getViewTranslation(this);
        let zoom = this.scene.getViewScale();
        return point.clone().sub(origin).scale(zoom);
    }
    /*---------- UNIQUE ----------*/
    get id() {
        return this._id;
    }
    set id(id) {
        // id can only be set once
        if (this._id === undefined) {
            this._id = id;
        }
        else {
            throw "Attempted to assign id to object that already has id.";
        }
    }
    /*---------- PHYSICAL ----------*/
    // @implemented
    /**
     * @param velocity The velocity with which to move the object.
     */
    move(velocity) {
        if (this.frozen)
            return;
        this.moving = true;
        this._velocity = velocity;
    }
    ;
    moveOnPath(speed, path) {
        if (this.frozen)
            return;
        this.path = path;
        let dir = path.getMoveDirection(this);
        this.moving = true;
        this.pathfinding = true;
        this._velocity = dir.scale(speed);
    }
    // @implemented
    /**
     * @param velocity The velocity with which the object will move.
     */
    finishMove() {
        this.moving = false;
        this.position.add(this._velocity);
        if (this.pathfinding) {
            this.path.handlePathProgress(this);
            this.path = null;
            this.pathfinding = false;
        }
    }
    // @implemented
    /**
     * @param collisionShape The collider for this object. If this has a region (implements Region),
     * it will be used when no collision shape is specified (or if collision shape is null).
     * @param isCollidable Whether this is collidable or not. True by default.
     * @param isStatic Whether this is static or not. False by default
     */
    addPhysics(collisionShape, colliderOffset, isCollidable = true, isStatic = false) {
        // Initialize the physics variables
        this.hasPhysics = true;
        this.moving = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = true;
        this.isCollidable = isCollidable;
        this.isStatic = isStatic;
        this.isTrigger = false;
        this.triggerMask = 0;
        this.triggerEnters = new Array(32);
        this.triggerExits = new Array(32);
        this._velocity = Vec2_1.default.ZERO;
        this.sweptRect = new AABB_1.default();
        this.collidedWithTilemap = false;
        this.group = -1; // The default group, collides with everything
        // Set the collision shape if provided, or simply use the the region if there is one.
        if (collisionShape) {
            this.collisionShape = collisionShape;
            this.collisionShape.center = this.position;
        }
        else if ((0, Region_1.isRegion)(this)) {
            // If the gamenode has a region and no other is specified, use that
            this.collisionShape = this.boundary.clone();
        }
        else {
            throw "No collision shape specified for physics object.";
        }
        // If we were provided with a collider offset, set it. Otherwise there is no offset, so use the zero vector
        if (colliderOffset) {
            this.colliderOffset = colliderOffset;
        }
        else {
            this.colliderOffset = Vec2_1.default.ZERO;
        }
        // Initialize the swept rect
        this.sweptRect = this.collisionShape.getBoundingRect();
        // Register the object with physics
        this.scene.getPhysicsManager().registerObject(this);
    }
    /** Removes this object from the physics system */
    removePhysics() {
        // Remove this from the physics manager
        this.scene.getPhysicsManager().deregisterObject(this);
        // Nullify all physics fields
        this.hasPhysics = false;
        this.moving = false;
        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.active = false;
        this.isCollidable = false;
        this.isStatic = false;
        this.isTrigger = false;
        this.triggerMask = 0;
        this.triggerEnters = null;
        this.triggerExits = null;
        this._velocity = Vec2_1.default.ZERO;
        this.sweptRect = null;
        this.collidedWithTilemap = false;
        this.group = -1;
        this.collisionShape = null;
        this.colliderOffset = Vec2_1.default.ZERO;
        this.sweptRect = null;
    }
    /** Disables physics movement for this node */
    freeze() {
        this.frozen = true;
    }
    /** Reenables physics movement for this node */
    unfreeze() {
        this.frozen = false;
    }
    /** Prevents this object from participating in all collisions and triggers. It can still move. */
    disablePhysics() {
        this.active = false;
    }
    /** Enables this object to participate in collisions and triggers. This is only necessary if disablePhysics was called */
    enablePhysics() {
        this.active = true;
    }
    /**
     * Sets the collider for this GameNode
     * @param collider The new collider to use
     */
    setCollisionShape(collider) {
        this.collisionShape = collider;
        this.collisionShape.center.copy(this.position);
    }
    // @implemented
    /**
     * Sets this object to be a trigger for a specific group
     * @param group The name of the group that activates the trigger
     * @param onEnter The name of the event to send when this trigger is activated
     * @param onExit The name of the event to send when this trigger stops being activated
     */
    setTrigger(group, onEnter, onExit) {
        // Make this object a trigger
        this.isTrigger = true;
        // Get the number of the physics layer
        let layerNumber = this.scene.getPhysicsManager().getGroupNumber(group);
        if (layerNumber === 0) {
            console.warn(`Trigger for GameNode ${this.id} not set - group "${group}" was not recognized by the physics manager.`);
            return;
        }
        // Add this to the trigger mask
        this.triggerMask |= layerNumber;
        // Layer numbers are bits, so get which bit it is
        let index = Math.log2(layerNumber);
        // Set the event names
        this.triggerEnters[index] = onEnter;
        this.triggerExits[index] = onExit;
    }
    ;
    // @implemented
    /**
     * @param group The physics group this node should belong to
     */
    setGroup(group) {
        this.scene.getPhysicsManager().setGroup(this, group);
    }
    // @implemened
    getLastVelocity() {
        return this._velocity;
    }
    /*---------- ACTOR ----------*/
    get ai() {
        return this._ai;
    }
    set ai(ai) {
        if (!this._ai) {
            // If we haven't been previously had an ai, register us with the ai manager
            this.scene.getAIManager().registerActor(this);
        }
        this._ai = ai;
        this.aiActive = true;
    }
    // @implemented
    addAI(ai, options, type) {
        if (!this._ai) {
            this.scene.getAIManager().registerActor(this);
        }
        if (typeof ai === "string") {
            this._ai = this.scene.getAIManager().generateAI(ai);
        }
        else {
            this._ai = new ai();
        }
        // Question, how much do we want different type of AI to be handled the same, i.e. should GoapAI and AI similar methods and signatures for the sake of unity
        this._ai.initializeAI(this, options);
        this.aiActive = true;
    }
    // @implemented
    setAIActive(active, options) {
        this.aiActive = active;
        if (this.aiActive) {
            this.ai.activate(options);
        }
    }
    /*---------- TWEENABLE PROPERTIES ----------*/
    set positionX(value) {
        this.position.x = value;
    }
    set positionY(value) {
        this.position.y = value;
    }
    /*---------- GAME NODE ----------*/
    /**
     * Sets the scene for this object.
     * @param scene The scene this object belongs to.
     */
    setScene(scene) {
        this.scene = scene;
    }
    /**
     * Gets the scene this object is in.
     * @returns The scene this object belongs to
    */
    getScene() {
        return this.scene;
    }
    /**
     * Sets the layer of this object.
     * @param layer The layer this object will be on.
     */
    setLayer(layer) {
        this.layer = layer;
    }
    /**
     * Returns the layer this object is on.
     * @returns This layer this object is on.
    */
    getLayer() {
        return this.layer;
    }
    /** Called if the position vector is modified or replaced */
    positionChanged() {
        if (this.collisionShape) {
            if (this.colliderOffset) {
                this.collisionShape.center = this.position.clone().add(this.colliderOffset);
            }
            else {
                this.collisionShape.center = this.position.clone();
            }
        }
    }
    ;
    /**
     * Updates this GameNode
     * @param deltaT The timestep of the update.
     */
    update(deltaT) {
        // Defer event handling to AI.
        while (this.receiver.hasNextEvent()) {
            this._ai.handleEvent(this.receiver.getNextEvent());
        }
    }
    // @implemented
    debugRender() {
        // Draw the position of this GameNode
        Debug_1.default.drawPoint(this.relativePosition, Color_1.default.BLUE);
        // If velocity is not zero, draw a vector for it
        if (this._velocity && !this._velocity.isZero()) {
            Debug_1.default.drawRay(this.relativePosition, this._velocity.clone().scaleTo(20).add(this.relativePosition), Color_1.default.BLUE);
        }
        // If this has a collider, draw it
        if (this.collisionShape) {
            let color = this.isColliding ? Color_1.default.RED : Color_1.default.GREEN;
            if (this.isTrigger) {
                color = Color_1.default.MAGENTA;
            }
            color.a = 0.2;
            if (this.collisionShape instanceof AABB_1.default) {
                Debug_1.default.drawBox(this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale()), true, color);
            }
            else if (this.collisionShape instanceof Circle_1.default) {
                Debug_1.default.drawCircle(this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.hw * this.scene.getViewScale(), true, color);
            }
        }
    }
}
exports.default = GameNode;
var TweenableProperties;
(function (TweenableProperties) {
    TweenableProperties["posX"] = "positionX";
    TweenableProperties["posY"] = "positionY";
    TweenableProperties["scaleX"] = "scaleX";
    TweenableProperties["scaleY"] = "scaleY";
    TweenableProperties["rotation"] = "rotation";
    TweenableProperties["alpha"] = "alpha";
})(TweenableProperties = exports.TweenableProperties || (exports.TweenableProperties = {}));
},{"../DataTypes/Interfaces/Region":7,"../DataTypes/Shapes/AABB":14,"../DataTypes/Shapes/Circle":15,"../DataTypes/Vec2":21,"../Debug/Debug":22,"../Events/Emitter":24,"../Events/Receiver":28,"../Rendering/Animations/TweenController":67,"../Utils/Color":97}],38:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasNode_1 = __importDefault(require("./CanvasNode"));
const Color_1 = __importDefault(require("../Utils/Color"));
/**
 * The representation of a game object that doesn't rely on any resources to render - it is drawn to the screen by the canvas
 */
class Graphic extends CanvasNode_1.default {
    constructor() {
        super();
        this.color = Color_1.default.RED;
    }
    get alpha() {
        return this.color.a;
    }
    set alpha(a) {
        this.color.a = a;
    }
    // @deprecated
    /**
     * Sets the color of the Graphic. DEPRECATED
     * @param color The new color of the Graphic.
     */
    setColor(color) {
        this.color = color;
    }
    set colorR(r) {
        this.color.r = r;
    }
    get colorR() {
        return this.color.r;
    }
    set colorG(g) {
        this.color.g = g;
    }
    get colorG() {
        return this.color.g;
    }
    set colorB(b) {
        this.color.b = b;
    }
    get colorB() {
        return this.color.b;
    }
}
exports.default = Graphic;
},{"../Utils/Color":97,"./CanvasNode":36}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicType = void 0;
var GraphicType;
(function (GraphicType) {
    GraphicType["POINT"] = "POINT";
    GraphicType["RECT"] = "RECT";
    GraphicType["LINE"] = "LINE";
    GraphicType["PARTICLE"] = "PARTICLE";
})(GraphicType = exports.GraphicType || (exports.GraphicType = {}));
},{}],40:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graphic_1 = __importDefault(require("../Graphic"));
class Line extends Graphic_1.default {
    constructor(start, end) {
        super();
        this.start = start;
        this.end = end;
        this.thickness = 2;
        // Does this really have a meaning for lines?
        this.size.set(5, 5);
    }
    set start(pos) {
        this.position = pos;
    }
    get start() {
        return this.position;
    }
    set end(pos) {
        this._end = pos;
    }
    get end() {
        return this._end;
    }
}
exports.default = Line;
},{"../Graphic":38}],41:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Point_1 = __importDefault(require("./Point"));
/**
 * - Position X
- Velocity (speed and direction) X
- Color X
- Lifetime
- Age can be handled as lifetime
- Shape X
- Size X
- Transparency X
 */
class Particle extends Point_1.default {
    constructor(position, size, mass) {
        // Are we making this a circle?
        super(position);
        this.inUse = false;
        this.mass = mass;
    }
    setParticleActive(lifetime, position) {
        this.age = lifetime;
        this.inUse = true;
        this.visible = true;
        this.position = position;
    }
    decrementAge(decay) {
        this.age -= decay;
    }
    setParticleInactive() {
        this.inUse = false;
        this.visible = false;
    }
    set velY(y) {
        this.vel.y = y;
    }
    get velY() {
        return this.vel.y;
    }
}
exports.default = Particle;
},{"./Point":42}],42:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graphic_1 = __importDefault(require("../Graphic"));
/** A basic point to be drawn on the screen. */
class Point extends Graphic_1.default {
    constructor(position) {
        // Are we making this a circle?
        super();
        this.position = position;
        this.size.set(5, 5);
    }
}
exports.default = Point;
},{"../Graphic":38}],43:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graphic_1 = __importDefault(require("../Graphic"));
const Color_1 = __importDefault(require("../../Utils/Color"));
/** A basic rectangle to be drawn on the screen. */
class Rect extends Graphic_1.default {
    constructor(position, size) {
        super();
        this.position = position;
        this.size = size;
        this.borderColor = Color_1.default.TRANSPARENT;
        this.borderWidth = 0;
    }
    /**
     * Sets the border color of this rectangle
     * @param color The border color
     */
    setBorderColor(color) {
        this.borderColor = color;
    }
    // @deprecated
    getBorderColor() {
        return this.borderColor;
    }
    /**
     * Sets the border width of this rectangle
     * @param width The width of the rectangle in pixels
     */
    setBorderWidth(width) {
        this.borderWidth = width;
    }
    getBorderWidth() {
        return this.borderWidth;
    }
}
exports.default = Rect;
},{"../../Utils/Color":97,"../Graphic":38}],44:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __importDefault(require("./Sprite"));
const AnimationManager_1 = __importDefault(require("../../Rendering/Animations/AnimationManager"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
/** An sprite with specified animation frames. */
class AnimatedSprite extends Sprite_1.default {
    get cols() {
        return this.numCols;
    }
    get rows() {
        return this.numRows;
    }
    constructor(spritesheet) {
        super(spritesheet.name);
        this.numCols = spritesheet.columns;
        this.numRows = spritesheet.rows;
        // Set the size of the sprite to the sprite size specified by the spritesheet
        this.size.set(spritesheet.spriteWidth, spritesheet.spriteHeight);
        this.animation = new AnimationManager_1.default(this);
        // Add the animations to the animated sprite
        for (let animation of spritesheet.animations) {
            this.animation.add(animation.name, animation);
        }
    }
    /**
     * Gets the image offset for the current index of animation
     * @param index The index we're at in the animation
     * @returns A Vec2 containing the image offset
     */
    getAnimationOffset(index) {
        return new Vec2_1.default((index % this.numCols) * this.size.x, Math.floor(index / this.numCols) * this.size.y);
    }
}
exports.default = AnimatedSprite;
},{"../../DataTypes/Vec2":21,"../../Rendering/Animations/AnimationManager":63,"./Sprite":45}],45:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasNode_1 = __importDefault(require("../CanvasNode"));
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
/**
 * The representation of a sprite - an in-game image
 */
class Sprite extends CanvasNode_1.default {
    constructor(imageId) {
        super();
        this.imageId = imageId;
        let image = ResourceManager_1.default.getInstance().getImage(this.imageId);
        this.size = new Vec2_1.default(image.width, image.height);
        this.imageOffset = Vec2_1.default.ZERO;
        this.invertX = false;
        this.invertY = false;
    }
    /**
     * Sets the offset of the sprite from (0, 0) in the image's coordinates
     * @param offset The offset of the sprite from (0, 0) in image coordinates
     */
    setImageOffset(offset) {
        this.imageOffset = offset;
    }
    setImageId(imageId) {
        this.imageId = imageId;
    }
}
exports.default = Sprite;
},{"../../DataTypes/Vec2":21,"../../ResourceManager/ResourceManager":81,"../CanvasNode":36}],46:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const CanvasNode_1 = __importDefault(require("./CanvasNode"));
/**
 * The representation of a tilemap - this can consist of a combination of tilesets in one layer
 */
class Tilemap extends CanvasNode_1.default {
    // TODO: Make this no longer be specific to Tiled
    constructor(tilemapData, layer, tilesets, scale) {
        super();
        this.tilesets = tilesets;
        this.tileSize = new Vec2_1.default(0, 0);
        this.name = layer.name;
        let tilecount = 0;
        for (let tileset of tilesets) {
            tilecount += tileset.getTileCount() + 1;
        }
        this.collisionMap = new Array(tilecount);
        for (let i = 0; i < this.collisionMap.length; i++) {
            this.collisionMap[i] = false;
        }
        // Defer parsing of the data to child classes - this allows for isometric vs. orthographic tilemaps and handling of Tiled data or other data
        this.parseTilemapData(tilemapData, layer);
        this.scale.set(scale.x, scale.y);
    }
    /**
     * Returns an array of the tilesets associated with this tilemap
     * @returns An array of all of the tilesets assocaited with this tilemap.
     */
    getTilesets() {
        return this.tilesets;
    }
    /**
     * Returns the size of tiles in this tilemap as they appear in the game world after scaling
     * @returns A vector containing the size of tiles in this tilemap as they appear in the game world after scaling.
     */
    getTileSize() {
        return this.tileSize.scaled(this.scale.x, this.scale.y);
    }
    /**
     * Gets the tile size taking zoom into account
     * @returns The tile size with zoom
    */
    getTileSizeWithZoom() {
        let zoom = this.scene.getViewScale();
        return this.getTileSize().scale(zoom);
    }
    /**
     * Adds this tilemap to the physics system
    */
    addPhysics() {
        this.triggerEnters = new Array(32);
        this.triggerExits = new Array(32);
        this.hasPhysics = true;
        this.active = true;
        this.group = -1;
        this.scene.getPhysicsManager().registerTilemap(this);
    }
}
exports.default = Tilemap;
},{"../DataTypes/Vec2":21,"./CanvasNode":36}],47:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tilemap_1 = __importDefault(require("../Tilemap"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const Debug_1 = __importDefault(require("../../Debug/Debug"));
const Color_1 = __importDefault(require("../../Utils/Color"));
/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
class OrthogonalTilemap extends Tilemap_1.default {
    // @override
    parseTilemapData(tilemapData, layer) {
        // The size of the tilemap in local space
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;
        // The size of tiles
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        // The size of the tilemap on the canvas
        this.size.set(this.numCols * this.tileSize.x, this.numRows * this.tileSize.y);
        this.position.copy(this.size.scaled(0.5));
        this.data = layer.data;
        this.visible = layer.visible;
        // Whether the tilemap is collidable or not
        this.isCollidable = false;
        if (layer.properties) {
            for (let item of layer.properties) {
                if (item.name === "Collidable") {
                    this.isCollidable = item.value;
                    // Set all tiles besides "empty: 0" to be collidable
                    for (let i = 1; i < this.collisionMap.length; i++) {
                        this.collisionMap[i] = true;
                    }
                }
            }
        }
    }
    /**
     * Gets the dimensions of the tilemap
     * @returns A Vec2 containing the number of columns and the number of rows in the tilemap.
     */
    getDimensions() {
        return new Vec2_1.default(this.numCols, this.numRows);
    }
    /**
     * Gets the data value of the tile at the specified world position
     * @param worldCoords The coordinates in world space
     * @returns The data value of the tile
     */
    getTileAtWorldPosition(worldCoords) {
        let localCoords = this.getColRowAt(worldCoords);
        return this.getTileAtRowCol(localCoords);
    }
    /**
     * Get the tile at the specified row and column
     * @param rowCol The coordinates in tilemap space
     * @returns The data value of the tile
     */
    getTileAtRowCol(rowCol) {
        if (rowCol.x < 0 || rowCol.x >= this.numCols || rowCol.y < 0 || rowCol.y >= this.numRows) {
            return -1;
        }
        return this.data[rowCol.y * this.numCols + rowCol.x];
    }
    /**
     * Gets the world position of the tile at the specified index
     * @param index The index of the tile
     * @returns A Vec2 containing the world position of the tile
     */
    getTileWorldPosition(index) {
        // Get the local position
        let col = index % this.numCols;
        let row = Math.floor(index / this.numCols);
        // Get the world position
        let x = col * this.tileSize.x;
        let y = row * this.tileSize.y;
        return new Vec2_1.default(x, y);
    }
    /**
     * Gets the data value of the tile at the specified index
     * @param index The index of the tile
     * @returns The data value of the tile
     */
    getTile(index) {
        return this.data[index];
    }
    // @override
    setTile(index, type) {
        this.data[index] = type;
    }
    /**
     * Sets the tile at the specified row and column
     * @param rowCol The position of the tile in tilemap space
     * @param type The new data value of the tile
     */
    setTileAtRowCol(rowCol, type) {
        let index = rowCol.y * this.numCols + rowCol.x;
        this.setTile(index, type);
    }
    /**
     * Returns true if the tile at the specified row and column of the tilemap is collidable
     * @param indexOrCol The index of the tile or the column it is in
     * @param row The row the tile is in
     * @returns A flag representing whether or not the tile is collidable.
     */
    isTileCollidable(indexOrCol, row) {
        // The value of the tile
        let tile = 0;
        if (row) {
            // We have a column and a row
            tile = this.getTileAtRowCol(new Vec2_1.default(indexOrCol, row));
            if (tile < 0) {
                return false;
            }
        }
        else {
            if (indexOrCol < 0 || indexOrCol >= this.data.length) {
                // Tiles that don't exist aren't collidable
                return false;
            }
            // We have an index
            tile = this.getTile(indexOrCol);
        }
        return this.collisionMap[tile];
    }
    /**
     * Takes in world coordinates and returns the row and column of the tile at that position
     * @param worldCoords The coordinates of the potential tile in world space
     * @returns A Vec2 containing the coordinates of the potential tile in tilemap space
     */
    getColRowAt(worldCoords) {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);
        return new Vec2_1.default(col, row);
    }
    // @override
    update(deltaT) { }
    // @override
    debugRender() {
        // Half of the tile size
        let zoomedHalfTileSize = this.getTileSizeWithZoom().scaled(0.5);
        let halfTileSize = this.getTileSize().scaled(0.5);
        // The center of the top left tile
        let topLeft = this.position.clone().sub(this.size.scaled(0.5));
        // A vec to store the center
        let center = Vec2_1.default.ZERO;
        for (let col = 0; col < this.numCols; col++) {
            // Calculate the x-position
            center.x = topLeft.x + col * 2 * halfTileSize.x + halfTileSize.x;
            for (let row = 0; row < this.numRows; row++) {
                if (this.isCollidable && this.isTileCollidable(col, row)) {
                    // Calculate the y-position
                    center.y = topLeft.y + row * 2 * halfTileSize.y + halfTileSize.y;
                    // Draw a box for this tile
                    Debug_1.default.drawBox(this.inRelativeCoordinates(center), zoomedHalfTileSize, false, Color_1.default.BLUE);
                }
            }
        }
    }
}
exports.default = OrthogonalTilemap;
},{"../../DataTypes/Vec2":21,"../../Debug/Debug":22,"../../Utils/Color":97,"../Tilemap":46}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasNode_1 = __importDefault(require("./CanvasNode"));
const Color_1 = __importDefault(require("../Utils/Color"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const Input_1 = __importDefault(require("../Input/Input"));
/**
 * The representation of a UIElement - the parent class of things like buttons
 */
class UIElement extends CanvasNode_1.default {
    constructor(position) {
        super();
        this.position = position;
        this.backgroundColor = new Color_1.default(0, 0, 0, 0);
        this.borderColor = new Color_1.default(0, 0, 0, 0);
        this.borderRadius = 5;
        this.borderWidth = 1;
        this.padding = Vec2_1.default.ZERO;
        this.onClick = null;
        this.onClickEventId = null;
        this.onRelease = null;
        this.onReleaseEventId = null;
        this.onEnter = null;
        this.onEnterEventId = null;
        this.onLeave = null;
        this.onLeaveEventId = null;
        this.isClicked = false;
        this.isEntered = false;
    }
    // @deprecated
    setBackgroundColor(color) {
        this.backgroundColor = color;
    }
    // @deprecated
    setPadding(padding) {
        this.padding.copy(padding);
    }
    update(deltaT) {
        super.update(deltaT);
        // See of this object was just clicked
        if (Input_1.default.isMouseJustPressed()) {
            let clickPos = Input_1.default.getMousePressPosition();
            if (this.contains(clickPos.x, clickPos.y) && this.visible && !this.layer.isHidden()) {
                this.isClicked = true;
                if (this.onClick !== null) {
                    this.onClick();
                }
                if (this.onClickEventId !== null) {
                    let data = {};
                    this.emitter.fireEvent(this.onClickEventId, data);
                }
            }
        }
        // If the mouse wasn't just pressed, then we definitely weren't clicked
        if (!Input_1.default.isMousePressed()) {
            if (this.isClicked) {
                this.isClicked = false;
            }
        }
        // Check if the mouse is hovering over this element
        let mousePos = Input_1.default.getMousePosition();
        if (mousePos && this.contains(mousePos.x, mousePos.y)) {
            this.isEntered = true;
            if (this.onEnter !== null) {
                this.onEnter();
            }
            if (this.onEnterEventId !== null) {
                let data = {};
                this.emitter.fireEvent(this.onEnterEventId, data);
            }
        }
        else if (this.isEntered) {
            this.isEntered = false;
            if (this.onLeave !== null) {
                this.onLeave();
            }
            if (this.onLeaveEventId !== null) {
                let data = {};
                this.emitter.fireEvent(this.onLeaveEventId, data);
            }
        }
        else if (this.isClicked) {
            // If mouse is dragged off of element while down, it is not clicked anymore
            this.isClicked = false;
        }
    }
    /**
     * Overridable method for calculating background color - useful for elements that want to be colored on different after certain events
     * @returns The background color of the UIElement
     */
    calculateBackgroundColor() {
        return this.backgroundColor;
    }
    /**
     * Overridable method for calculating border color - useful for elements that want to be colored on different after certain events
     * @returns The border color of the UIElement
     */
    calculateBorderColor() {
        return this.borderColor;
    }
}
exports.default = UIElement;
},{"../DataTypes/Vec2":21,"../Input/Input":29,"../Utils/Color":97,"./CanvasNode":36}],49:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Label_1 = __importDefault(require("./Label"));
const Color_1 = __importDefault(require("../../Utils/Color"));
/** A clickable button UIElement */
class Button extends Label_1.default {
    constructor(position, text) {
        super(position, text);
        this.backgroundColor = new Color_1.default(150, 75, 203);
        this.borderColor = new Color_1.default(41, 46, 30);
        this.textColor = new Color_1.default(255, 255, 255);
    }
    // @override
    calculateBackgroundColor() {
        // Change the background color if clicked or hovered
        if (this.isEntered && !this.isClicked) {
            return this.backgroundColor.lighten();
        }
        else if (this.isClicked) {
            return this.backgroundColor.darken();
        }
        else {
            return this.backgroundColor;
        }
    }
}
exports.default = Button;
},{"../../Utils/Color":97,"./Label":50}],50:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAlign = exports.VAlign = void 0;
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const Color_1 = __importDefault(require("../../Utils/Color"));
const UIElement_1 = __importDefault(require("../UIElement"));
/** A basic text-containing label */
class Label extends UIElement_1.default {
    constructor(position, text, fontSize) {
        super(position);
        this.text = text;
        this.textColor = Color_1.default.WHITE;
        this.font = "Arial";
        this.fontSize = fontSize || 30;
        this.hAlign = "center";
        this.vAlign = "center";
        this.sizeAssigned = false;
    }
    // @deprecated
    setText(text) {
        this.text = text;
    }
    // @deprecated
    setTextColor(color) {
        this.textColor = color;
    }
    /**
     * Gets a string containg the font details for rendering
     * @returns A string containing the font details
     */
    getFontString() {
        return this.fontSize + "px " + this.font;
    }
    /**
     * Overridable method for calculating text color - useful for elements that want to be colored on different after certain events
     * @returns a string containg the text color
     */
    calculateTextColor() {
        return this.textColor.toStringRGBA();
    }
    /**
     * Uses the canvas to calculate the width of the text
     * @param ctx The rendering context
     * @returns A number representing the rendered text width
     */
    calculateTextWidth(ctx) {
        ctx.font = this.fontSize + "px " + this.font;
        return ctx.measureText(this.text).width;
    }
    setHAlign(align) {
        this.hAlign = align;
    }
    setVAlign(align) {
        this.vAlign = align;
    }
    /**
     * Calculate the offset of the text - this is used for rendering text with different alignments
     * @param ctx The rendering context
     * @returns The offset of the text in a Vec2
     */
    calculateTextOffset(ctx) {
        let textWidth = this.calculateTextWidth(ctx);
        let offset = new Vec2_1.default(0, 0);
        let hDiff = this.size.x - textWidth;
        if (this.hAlign === HAlign.CENTER) {
            offset.x = hDiff / 2;
        }
        else if (this.hAlign === HAlign.RIGHT) {
            offset.x = hDiff;
        }
        if (this.vAlign === VAlign.TOP) {
            ctx.textBaseline = "top";
            offset.y = 0;
        }
        else if (this.vAlign === VAlign.BOTTOM) {
            ctx.textBaseline = "bottom";
            offset.y = this.size.y;
        }
        else {
            ctx.textBaseline = "middle";
            offset.y = this.size.y / 2;
        }
        return offset;
    }
    sizeChanged() {
        super.sizeChanged();
        this.sizeAssigned = true;
    }
    /**
     * Automatically sizes the element to the text within it
     * @param ctx The rendering context
     */
    autoSize(ctx) {
        let width = this.calculateTextWidth(ctx);
        let height = this.fontSize;
        this.size.set(width + this.padding.x * 2, height + this.padding.y * 2);
        this.sizeAssigned = true;
    }
    /**
     * Initially assigns a size to the UIElement if none is provided
     * @param ctx The rendering context
     */
    handleInitialSizing(ctx) {
        if (!this.sizeAssigned) {
            this.autoSize(ctx);
        }
    }
    /** On the next render, size this element to it's current text using its current font size */
    sizeToText() {
        this.sizeAssigned = false;
    }
}
exports.default = Label;
var VAlign;
(function (VAlign) {
    VAlign["TOP"] = "top";
    VAlign["CENTER"] = "center";
    VAlign["BOTTOM"] = "bottom";
})(VAlign = exports.VAlign || (exports.VAlign = {}));
var HAlign;
(function (HAlign) {
    HAlign["LEFT"] = "left";
    HAlign["CENTER"] = "center";
    HAlign["RIGHT"] = "right";
})(HAlign = exports.HAlign || (exports.HAlign = {}));
},{"../../DataTypes/Vec2":21,"../../Utils/Color":97,"../UIElement":48}],51:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const Input_1 = __importDefault(require("../../Input/Input"));
const Color_1 = __importDefault(require("../../Utils/Color"));
const MathUtils_1 = __importDefault(require("../../Utils/MathUtils"));
const UIElement_1 = __importDefault(require("../UIElement"));
/** A slider UIElement */
class Slider extends UIElement_1.default {
    constructor(position, initValue) {
        super(position);
        this.value = initValue;
        this.nibColor = Color_1.default.RED;
        this.sliderColor = Color_1.default.BLACK;
        this.backgroundColor = Color_1.default.TRANSPARENT;
        this.borderColor = Color_1.default.TRANSPARENT;
        this.nibSize = new Vec2_1.default(10, 20);
        // Set a default size
        this.size.set(200, 20);
    }
    /**
     * Retrieves the value of the slider
     * @returns The value of the slider
     */
    getValue() {
        return this.value;
    }
    /** A method called in response to the value changing */
    valueChanged() {
        if (this.onValueChange) {
            this.onValueChange(this.value);
        }
        if (this.onValueChangeEventId) {
            this.emitter.fireEvent(this.onValueChangeEventId, { target: this, value: this.value });
        }
    }
    update(deltaT) {
        super.update(deltaT);
        if (this.isClicked) {
            let val = MathUtils_1.default.invLerp(this.position.x - this.size.x / 2, this.position.x + this.size.x / 2, Input_1.default.getMousePosition().x);
            this.value = MathUtils_1.default.clamp01(val);
            this.valueChanged();
        }
    }
}
exports.default = Slider;
},{"../../DataTypes/Vec2":21,"../../Input/Input":29,"../../Utils/Color":97,"../../Utils/MathUtils":100,"../UIElement":48}],52:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("../../Utils/Color"));
const Label_1 = __importDefault(require("./Label"));
const Input_1 = __importDefault(require("../../Input/Input"));
/** A text input UIElement */
class TextInput extends Label_1.default {
    constructor(position) {
        super(position, "");
        this.focused = false;
        this.cursorCounter = 0;
        // Give a default size to the x only
        this.size.set(200, this.fontSize);
        this.hAlign = "left";
        this.borderColor = Color_1.default.BLACK;
        this.backgroundColor = Color_1.default.WHITE;
    }
    update(deltaT) {
        super.update(deltaT);
        if (Input_1.default.isMouseJustPressed()) {
            let clickPos = Input_1.default.getMousePressPosition();
            if (this.contains(clickPos.x, clickPos.y)) {
                this.focused = true;
                this.cursorCounter = 30;
            }
            else {
                this.focused = false;
            }
        }
        if (this.focused) {
            let keys = Input_1.default.getKeysJustPressed();
            let nums = "1234567890";
            let specialChars = "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?";
            let letters = "qwertyuiopasdfghjklzxcvbnm";
            let mask = nums + specialChars + letters;
            keys = keys.filter(key => mask.includes(key));
            let shiftPressed = Input_1.default.isKeyPressed("shift");
            let backspacePressed = Input_1.default.isKeyJustPressed("backspace");
            let spacePressed = Input_1.default.isKeyJustPressed("space");
            if (backspacePressed) {
                this.text = this.text.substring(0, this.text.length - 1);
            }
            else if (spacePressed) {
                this.text += " ";
            }
            else if (keys.length > 0) {
                if (shiftPressed) {
                    this.text += keys[0].toUpperCase();
                }
                else {
                    this.text += keys[0];
                }
            }
        }
    }
}
exports.default = TextInput;
},{"../../Input/Input":29,"../../Utils/Color":97,"./Label":50}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElementType = void 0;
var UIElementType;
(function (UIElementType) {
    UIElementType["BUTTON"] = "BUTTON";
    UIElementType["LABEL"] = "LABEL";
    UIElementType["SLIDER"] = "SLIDER";
    UIElementType["TEXT_INPUT"] = "TEXTINPUT";
})(UIElementType = exports.UIElementType || (exports.UIElementType = {}));
},{}],54:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
/**
 * The manager class for navigation.
 * Handles all navigable entities, such and allows them to be accessed by outside systems by requesting a path
 * from one position to another.
 */
class NavigationManager {
    constructor() {
        this.navigableEntities = new Map_1.default();
    }
    /**
     * Adds a navigable entity to the NavigationManager
     * @param navName The name of the navigable entitry
     * @param nav The actual Navigable instance
     */
    addNavigableEntity(navName, nav) {
        this.navigableEntities.add(navName, nav);
    }
    /**
     * Gets a path frome one point to another using a specified Navigable object
     * @param navName The name of the registered Navigable object
     * @param fromPosition The starting position of navigation
     * @param toPosition The ending position of Navigation
     * @param direct If true, go direct from fromPosition to toPosition, don't use NavMesh
     * @returns A NavigationPath containing the route to take over the Navigable entity to get between the provided positions.
     */
    getPath(navName, fromPosition, toPosition, direct) {
        let nav = this.navigableEntities.get(navName);
        return nav.getNavigationPath(fromPosition.clone(), toPosition.clone(), direct);
    }
}
exports.default = NavigationManager;
},{"../DataTypes/Map":8}],55:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
/**
 * A path that AIs can follow. Uses finishMove() in Physical to determine progress on the route
 */
class NavigationPath {
    /**
     * Constructs a new NavigationPath
     * @param path The path of nodes to take
     */
    constructor(path) {
        this.path = path;
        this.currentMoveDirection = Vec2_1.default.ZERO;
        this.distanceThreshold = 4;
    }
    /**
     * Returns the status of navigation along this NavigationPath
     * @returns True if the node has reached the end of the path, false otherwise
     */
    isDone() {
        return this.path.isEmpty();
    }
    /**
     * Gets the movement direction in the current position along the path
     * @param node The node to move along the path
     * @returns The movement direction as a Vec2
     */
    getMoveDirection(node) {
        // Return direction to next point in the nav
        return node.position.dirTo(this.path.peek());
    }
    /**
     * Updates this NavigationPath to the current state of the GameNode
     * @param node The node moving along the path
     */
    handlePathProgress(node) {
        if (node.position.distanceSqTo(this.path.peek()) < this.distanceThreshold * this.distanceThreshold) {
            // We've reached our node, move on to the next destination
            this.path.pop();
        }
    }
    toString() {
        return this.path.toString();
    }
}
exports.default = NavigationPath;
},{"../DataTypes/Vec2":21}],56:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stack_1 = __importDefault(require("../DataTypes/Stack"));
const GraphUtils_1 = __importDefault(require("../Utils/GraphUtils"));
const NavigationPath_1 = __importDefault(require("./NavigationPath"));
/**
 * An implementation of a Navmesh. Navmeshes are graphs in the game world along which nodes can move.
 */
class Navmesh {
    /**
     * Creates a new Navmesh from the points in the speecified graph
     * @param graph The graph to construct a navmesh from
     */
    constructor(graph) {
        this.graph = graph;
    }
    // @implemented
    getNavigationPath(fromPosition, toPosition, direct) {
        let start = this.getClosestNode(fromPosition);
        let end = this.getClosestNode(toPosition);
        let pathStack = new Stack_1.default(this.graph.numVertices);
        // Push the final position and the final position in the graph
        pathStack.push(toPosition.clone());
        if (direct) {
            return new NavigationPath_1.default(pathStack);
        }
        pathStack.push(this.graph.positions[end]);
        let parent = GraphUtils_1.default.djikstra(this.graph, start);
        // Add all parents along the path
        let i = end;
        while (parent[i] !== -1) {
            pathStack.push(this.graph.positions[parent[i]]);
            i = parent[i];
        }
        return new NavigationPath_1.default(pathStack);
    }
    /**
     * Gets the closest node in this Navmesh to the specified position
     * @param position The position to query
     * @returns The index of the closest node in the Navmesh to the position
     */
    getClosestNode(position) {
        let n = this.graph.numVertices;
        let i = 1;
        let index = 0;
        let dist = position.distanceSqTo(this.graph.positions[0]);
        while (i < n) {
            let d = position.distanceSqTo(this.graph.positions[i]);
            if (d < dist) {
                dist = d;
                index = i;
            }
            i++;
        }
        return index;
    }
}
exports.default = Navmesh;
},{"../DataTypes/Stack":17,"../Utils/GraphUtils":99,"./NavigationPath":55}],57:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PhysicsManager_1 = __importDefault(require("./PhysicsManager"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const AABB_1 = __importDefault(require("../DataTypes/Shapes/AABB"));
const OrthogonalTilemap_1 = __importDefault(require("../Nodes/Tilemaps/OrthogonalTilemap"));
const AreaCollision_1 = __importDefault(require("../DataTypes/Physics/AreaCollision"));
/**
 * ALGORITHM:
 * 	In an effort to keep things simple and working effectively, each dynamic node will resolve its
 * 	collisions considering the rest of the world as static.
 *
 * 	Collision detecting will happen first. This can be considered a broad phase, but it is not especially
 * 	efficient, as it does not need to be for this game engine. Every dynamic node is checked against every
 * 	other node for collision area. If collision area is non-zero (meaning the current node sweeps into another),
 * 	it is added to a list of hits.
 *
 * 	INITIALIZATION:
 * 		- Physics constants are reset
 * 		- Swept shapes are recalculated. If a node isn't moving, it is skipped.
 *
 * 	COLLISION DETECTION:
 * 		- For a node, collision area will be calculated using the swept AABB of the node against every other AABB in a static state
 * 		- These collisions will be sorted by area in descending order
 *
 * 	COLLISION RESOLUTION:
 * 		- For each hit, time of collision is calculated using a swept line through the AABB of the static node expanded
 * 			with minkowski sums (discretely, but the concept is there)
 * 		- The collision is resolved based on the near time of the collision (from method of separated axes)
 * 			- X is resolved by near x, Y by near y.
 * 			- There is some fudging to allow for sliding along walls of separate colliders. Sorting by area also helps with this.
 * 			- Corner to corner collisions are resolve to favor x-movement. This is in consideration of platformers, to give
 * 				the player some help with jumps
 *
 * 	Pros:
 * 		- Everything happens with a consistent time. There is a distinct before and after for each resolution.
 * 		- No back-tracking needs to be done. Once we resolve a node, it is definitively resolved.
 *
 * 	Cons:
 * 		- Nodes that are processed early have movement priority over other nodes. This can lead to some undesirable interactions.
 */
class BasicPhysicsManager extends PhysicsManager_1.default {
    constructor(options) {
        super();
        this.staticNodes = new Array();
        this.dynamicNodes = new Array();
        this.tilemaps = new Array();
        this.collisionMasks = new Array(32);
        // Parse options
        this.parseOptions(options);
    }
    /**
     * Parses the options for constructing the physics manager
     * @param options A record of options
     */
    parseOptions(options) {
        if (options.groupNames !== undefined && options.collisions !== undefined) {
            for (let i = 0; i < options.groupNames.length; i++) {
                let group = options.groupNames[i];
                // Register the group name and number
                this.groupNames[i] = group;
                this.groupMap.set(group, 1 << i);
                let collisionMask = 0;
                for (let j = 0; j < options.collisions[i].length; j++) {
                    if (options.collisions[i][j]) {
                        collisionMask |= 1 << j;
                    }
                }
                this.collisionMasks[i] = collisionMask;
            }
        }
    }
    // @override
    registerObject(node) {
        if (node.isStatic) {
            // Static and not collidable
            this.staticNodes.push(node);
        }
        else {
            // Dynamic and not collidable
            this.dynamicNodes.push(node);
        }
    }
    // @override
    deregisterObject(node) {
        if (node.isStatic) {
            // Remove the node from the static list
            const index = this.staticNodes.indexOf(node);
            this.staticNodes.splice(index, 1);
        }
        else {
            // Remove the node from the dynamic list
            const index = this.dynamicNodes.indexOf(node);
            this.dynamicNodes.splice(index, 1);
        }
    }
    // @override
    registerTilemap(tilemap) {
        this.tilemaps.push(tilemap);
    }
    // @override
    deregisterTilemap(tilemap) {
        const index = this.tilemaps.indexOf(tilemap);
        this.tilemaps.splice(index, 1);
    }
    // @override
    update(deltaT) {
        for (let node of this.dynamicNodes) {
            /*---------- INITIALIZATION PHASE ----------*/
            // Clear frame dependent boolean values for each node
            node.onGround = false;
            node.onCeiling = false;
            node.onWall = false;
            node.collidedWithTilemap = false;
            node.isColliding = false;
            // If this node is not active, don't process it
            if (!node.active) {
                continue;
            }
            // Update the swept shapes of each node
            if (node.moving) {
                // If moving, reflect that in the swept shape
                node.sweptRect.sweep(node._velocity, node.collisionShape.center, node.collisionShape.halfSize);
            }
            else {
                // If our node isn't moving, don't bother to check it (other nodes will detect if they run into it)
                node._velocity.zero();
                continue;
            }
            /*---------- DETECTION PHASE ----------*/
            // Gather a set of overlaps
            let overlaps = new Array();
            let groupIndex = node.group === -1 ? -1 : Math.log2(node.group);
            // First, check this node against every static node (order doesn't actually matter here, since we sort anyways)
            for (let other of this.staticNodes) {
                // Ignore inactive nodes
                if (!other.active)
                    continue;
                let collider = other.collisionShape.getBoundingRect();
                let area = node.sweptRect.overlapArea(collider);
                if (area > 0) {
                    // We had a collision
                    overlaps.push(new AreaCollision_1.default(area, collider, other, "GameNode", null));
                }
            }
            // Then, check it against every dynamic node
            for (let other of this.dynamicNodes) {
                // Ignore ourselves
                if (node === other)
                    continue;
                // Ignore inactive nodes
                if (!other.active)
                    continue;
                let collider = other.collisionShape.getBoundingRect();
                let area = node.sweptRect.overlapArea(collider);
                if (area > 0) {
                    // We had a collision
                    overlaps.push(new AreaCollision_1.default(area, collider, other, "GameNode", null));
                }
            }
            // Lastly, gather a set of AABBs from the tilemap.
            // This step involves the most extra work, so it is abstracted into a method
            for (let tilemap of this.tilemaps) {
                // Ignore inactive tilemaps
                if (!tilemap.active)
                    continue;
                if (tilemap instanceof OrthogonalTilemap_1.default) {
                    this.collideWithOrthogonalTilemap(node, tilemap, overlaps);
                }
            }
            // Sort the overlaps by area
            overlaps = overlaps.sort((a, b) => b.area - a.area);
            // Keep track of hits to use later
            let hits = [];
            /*---------- RESOLUTION PHASE ----------*/
            // For every overlap, determine if we need to collide with it and when
            for (let overlap of overlaps) {
                // Ignore nodes we don't interact with
                if (groupIndex !== -1 && overlap.other.group !== -1 && ((this.collisionMasks[groupIndex] & overlap.other.group) === 0))
                    continue;
                // Do a swept line test on the static AABB with this AABB size as padding (this is basically using a minkowski sum!)
                // Start the sweep at the position of this node with a delta of _velocity
                const point = node.collisionShape.center;
                const delta = node._velocity;
                const padding = node.collisionShape.halfSize;
                const otherAABB = overlap.collider;
                const hit = otherAABB.intersectSegment(node.collisionShape.center, node._velocity, node.collisionShape.halfSize);
                overlap.hit = hit;
                if (hit !== null) {
                    hits.push(hit);
                    // We got a hit, resolve with the time inside of the hit
                    let tnearx = hit.nearTimes.x;
                    let tneary = hit.nearTimes.y;
                    // Allow edge clipping (edge overlaps don't count, only area overlaps)
                    // Importantly don't allow both cases to be true. Then we clip through corners. Favor x to help players land jumps
                    if (tnearx < 1.0 && (point.y === otherAABB.top - padding.y || point.y === otherAABB.bottom + padding.y) && delta.x !== 0) {
                        tnearx = 1.0;
                    }
                    else if (tneary < 1.0 && (point.x === otherAABB.left - padding.x || point.x === otherAABB.right + padding.x) && delta.y !== 0) {
                        tneary = 1.0;
                    }
                    if (hit.nearTimes.x >= 0 && hit.nearTimes.x < 1) {
                        // Any tilemap objects that made it here are collidable
                        if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                            node._velocity.x = node._velocity.x * tnearx;
                            node.isColliding = true;
                        }
                    }
                    if (hit.nearTimes.y >= 0 && hit.nearTimes.y < 1) {
                        // Any tilemap objects that made it here are collidable
                        if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                            node._velocity.y = node._velocity.y * tneary;
                            node.isColliding = true;
                        }
                    }
                }
            }
            /*---------- INFORMATION/TRIGGER PHASE ----------*/
            // Check if we ended up on the ground, ceiling or wall
            // Also check for triggers
            for (let overlap of overlaps) {
                // Check for a trigger. If we care about the trigger, react
                if (overlap.other.isTrigger && (overlap.other.triggerMask & node.group)) {
                    // Get the bit that this group is represented by
                    let index = Math.floor(Math.log2(node.group));
                    // Extract the triggerEnter event name
                    this.emitter.fireEvent(overlap.other.triggerEnters[index], {
                        node: node.id,
                        other: overlap.other.id
                    });
                }
                // Ignore collision sides for nodes we don't interact with
                if (groupIndex !== -1 && overlap.other.group !== -1 && ((this.collisionMasks[groupIndex] & overlap.other.group) === 0))
                    continue;
                // Only check for direction if the overlap was collidable
                if (overlap.type === "Tilemap" || overlap.other.isCollidable) {
                    let collisionSide = overlap.collider.touchesAABBWithoutCorners(node.collisionShape.getBoundingRect());
                    if (collisionSide !== null) {
                        // If we touch, not including corner cases, check the collision normal
                        if (overlap.hit !== null) {
                            // If we hit a tilemap, keep track of it
                            if (overlap.type == "Tilemap") {
                                node.collidedWithTilemap = true;
                            }
                            if (collisionSide.y === -1) {
                                // Node is on top of overlap, so onGround
                                node.onGround = true;
                            }
                            else if (collisionSide.y === 1) {
                                // Node is on bottom of overlap, so onCeiling
                                node.onCeiling = true;
                            }
                            else {
                                // Node wasn't touching on y, so it is touching on x
                                node.onWall = true;
                            }
                        }
                    }
                }
            }
            // Resolve the collision with the node, and move it
            node.finishMove();
        }
    }
    /**
     * Handles a collision between this node and an orthogonal tilemap
     * @param node The node
     * @param tilemap The tilemap the node may be colliding with
     * @param overlaps The list of overlaps
     */
    collideWithOrthogonalTilemap(node, tilemap, overlaps) {
        // Get the min and max x and y coordinates of the moving node
        let min = new Vec2_1.default(node.sweptRect.left, node.sweptRect.top);
        let max = new Vec2_1.default(node.sweptRect.right, node.sweptRect.bottom);
        // Convert the min/max x/y to the min and max row/col in the tilemap array
        let minIndex = tilemap.getColRowAt(min);
        let maxIndex = tilemap.getColRowAt(max);
        let tileSize = tilemap.getTileSize();
        // Loop over all possible tiles (which isn't many in the scope of the velocity per frame)
        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (tilemap.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2_1.default(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);
                    // Create a new collider for this tile
                    let collider = new AABB_1.default(tilePos, tileSize.scaled(1 / 2));
                    // Calculate collision area between the node and the tile
                    let area = node.sweptRect.overlapArea(collider);
                    if (area > 0) {
                        // We had a collision
                        overlaps.push(new AreaCollision_1.default(area, collider, tilemap, "Tilemap", new Vec2_1.default(col, row)));
                    }
                }
            }
        }
    }
}
exports.default = BasicPhysicsManager;
},{"../DataTypes/Physics/AreaCollision":10,"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":21,"../Nodes/Tilemaps/OrthogonalTilemap":47,"./PhysicsManager":58}],58:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const Emitter_1 = __importDefault(require("../Events/Emitter"));
const Map_1 = __importDefault(require("../DataTypes/Map"));
/**
 * An abstract physics manager.
 * This class exposes functions for subclasses to implement that should allow for a working physics system to be created.
 */
class PhysicsManager {
    constructor() {
        this.receiver = new Receiver_1.default();
        this.emitter = new Emitter_1.default();
        // The creation and implementation of layers is deferred to the subclass
        this.groupMap = new Map_1.default();
        this.groupNames = new Array();
    }
    destroy() {
        this.receiver.destroy();
    }
    /**
     * Sets the physics layer of the GameNode
     * @param node The GameNode
     * @param group The group that the GameNode should be on
     */
    setGroup(node, group) {
        node.group = this.groupMap.get(group);
    }
    /**
     * Retrieves the layer number associated with the provided name
     * @param layer The name of the layer
     * @returns The layer number, or 0 if there is not a layer with that name registered
     */
    getGroupNumber(group) {
        if (this.groupMap.has(group)) {
            return this.groupMap.get(group);
        }
        else {
            return 0;
        }
    }
    /**
     * Gets all group names associated with the number provided
     * @param groups A mask of groups
     * @returns All groups contained in the mask
     */
    getGroupNames(groups) {
        if (groups === -1) {
            return [PhysicsManager.DEFAULT_GROUP];
        }
        else {
            let g = 1;
            let names = [];
            for (let i = 0; i < 32; i++) {
                if (g & groups) {
                    // This group is in the groups number
                    names.push(this.groupNames[i]);
                }
                // Shift the bit over
                g = g << 1;
            }
        }
    }
}
exports.default = PhysicsManager;
/** The default group name */
PhysicsManager.DEFAULT_GROUP = "Default";
},{"../DataTypes/Map":8,"../Events/Emitter":24,"../Events/Receiver":28}],59:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = __importDefault(require("../DataTypes/Queue"));
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const EventQueue_1 = __importDefault(require("../Events/EventQueue"));
const GameEventType_1 = require("../Events/GameEventType");
// @ignorePage
class Recorder {
    constructor() {
        this.receiver = new Receiver_1.default();
        this.log = new Queue_1.default(1000);
        this.recording = false;
        this.playing = false;
        this.frame = 0;
        this.eventQueue = EventQueue_1.default.getInstance();
        this.eventQueue.subscribe(this.receiver, "all");
    }
    update(deltaT) {
        if (this.recording) {
            this.frame += 1;
        }
        if (this.playing) {
            // If playing, ignore events, just feed the record to the event queue
            this.receiver.ignoreEvents();
            /*
                While there is a next item, and while it should occur in this frame,
                send the event. i.e., while current_frame * current_delta_t is greater
                than recorded_frame * recorded_delta_t
            */
            while (this.log.hasItems()
                && this.log.peekNext().frame * this.log.peekNext().delta < this.frame * deltaT) {
                let event = this.log.dequeue().event;
                console.log(event);
                this.eventQueue.addEvent(event);
            }
            if (!this.log.hasItems()) {
                this.playing = false;
            }
            this.frame += 1;
        }
        else {
            // If not playing, handle events
            while (this.receiver.hasNextEvent()) {
                let event = this.receiver.getNextEvent();
                if (event.type === GameEventType_1.GameEventType.STOP_RECORDING) {
                    this.recording = false;
                }
                if (this.recording) {
                    this.log.enqueue(new LogItem(this.frame, deltaT, event));
                }
                if (event.type === GameEventType_1.GameEventType.START_RECORDING) {
                    this.log.clear();
                    this.recording = true;
                    this.frame = 0;
                }
                if (event.type === GameEventType_1.GameEventType.PLAY_RECORDING) {
                    this.frame = 0;
                    this.recording = false;
                    this.playing = true;
                }
            }
        }
    }
}
exports.default = Recorder;
class LogItem {
    constructor(frame, deltaT, event) {
        this.frame = frame;
        this.delta = deltaT;
        this.event = event;
    }
}
},{"../DataTypes/Queue":12,"../Events/EventQueue":25,"../Events/GameEventType":27,"../Events/Receiver":28}],60:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../../DataTypes/Map"));
/** */
class Registry extends Map_1.default {
}
exports.default = Registry;
},{"../../DataTypes/Map":8}],61:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LabelShaderType_1 = __importDefault(require("../../Rendering/WebGLRendering/ShaderTypes/LabelShaderType"));
const PointShaderType_1 = __importDefault(require("../../Rendering/WebGLRendering/ShaderTypes/PointShaderType"));
const RectShaderType_1 = __importDefault(require("../../Rendering/WebGLRendering/ShaderTypes/RectShaderType"));
const SpriteShaderType_1 = __importDefault(require("../../Rendering/WebGLRendering/ShaderTypes/SpriteShaderType"));
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const Registry_1 = __importDefault(require("./Registry"));
/**
 * A registry that handles shaders
 */
class ShaderRegistry extends Registry_1.default {
    constructor() {
        super(...arguments);
        this.registryItems = new Array();
    }
    /**
     * Preloads all built-in shaders
     */
    preload() {
        // Get the resourceManager and queue all built-in shaders for preloading
        const rm = ResourceManager_1.default.getInstance();
        // Queue a load for the point shader
        this.registerAndPreloadItem(ShaderRegistry.POINT_SHADER, PointShaderType_1.default, "builtin/shaders/point.vshader", "builtin/shaders/point.fshader");
        // Queue a load for the rect shader
        this.registerAndPreloadItem(ShaderRegistry.RECT_SHADER, RectShaderType_1.default, "builtin/shaders/rect.vshader", "builtin/shaders/rect.fshader");
        // Queue a load for the sprite shader
        this.registerAndPreloadItem(ShaderRegistry.SPRITE_SHADER, SpriteShaderType_1.default, "builtin/shaders/sprite.vshader", "builtin/shaders/sprite.fshader");
        // Queue a load for the label shader
        this.registerAndPreloadItem(ShaderRegistry.LABEL_SHADER, LabelShaderType_1.default, "builtin/shaders/label.vshader", "builtin/shaders/label.fshader");
        // Queue a load for any preloaded items
        for (let item of this.registryItems) {
            const shader = new item.constr(item.key);
            shader.initBufferObject();
            this.add(item.key, shader);
            // Load if desired
            if (item.preload !== undefined) {
                rm.shader(item.key, item.preload.vshaderLocation, item.preload.fshaderLocation);
            }
        }
    }
    /**
     * Registers a shader in the registry and loads it before the game begins
     * @param key The key you wish to assign to the shader
     * @param constr The constructor of the ShaderType
     * @param vshaderLocation The location of the vertex shader
     * @param fshaderLocation the location of the fragment shader
     */
    registerAndPreloadItem(key, constr, vshaderLocation, fshaderLocation) {
        let shaderPreload = new ShaderPreload();
        shaderPreload.vshaderLocation = vshaderLocation;
        shaderPreload.fshaderLocation = fshaderLocation;
        let registryItem = new ShaderRegistryItem();
        registryItem.key = key;
        registryItem.constr = constr;
        registryItem.preload = shaderPreload;
        this.registryItems.push(registryItem);
    }
    /**
     * Registers a shader in the registry. NOTE: If you use this, you MUST load the shader before use.
     * If you wish to preload the shader, use registerAndPreloadItem()
     * @param key The key you wish to assign to the shader
     * @param constr The constructor of the ShaderType
     */
    registerItem(key, constr) {
        let registryItem = new ShaderRegistryItem();
        registryItem.key = key;
        registryItem.constr = constr;
        this.registryItems.push(registryItem);
    }
}
exports.default = ShaderRegistry;
// Shader names
ShaderRegistry.POINT_SHADER = "point";
ShaderRegistry.RECT_SHADER = "rect";
ShaderRegistry.SPRITE_SHADER = "sprite";
ShaderRegistry.LABEL_SHADER = "label";
class ShaderRegistryItem {
}
class ShaderPreload {
}
},{"../../Rendering/WebGLRendering/ShaderTypes/LabelShaderType":76,"../../Rendering/WebGLRendering/ShaderTypes/PointShaderType":77,"../../Rendering/WebGLRendering/ShaderTypes/RectShaderType":79,"../../Rendering/WebGLRendering/ShaderTypes/SpriteShaderType":80,"../../ResourceManager/ResourceManager":81,"./Registry":60}],62:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
const ShaderRegistry_1 = __importDefault(require("./Registries/ShaderRegistry"));
/**
 * The Registry is the system's way of converting classes and types into string
 * representations for use elsewhere in the application.
 * It allows classes to be accessed without explicitly using constructors in code,
 * and for resources to be loaded at Game creation time.
 */
class RegistryManager {
    static preload() {
        this.shaders.preload();
        this.registries.forEach((key) => this.registries.get(key).preload());
    }
    static addCustomRegistry(name, registry) {
        this.registries.add(name, registry);
    }
    static getRegistry(key) {
        return this.registries.get(key);
    }
}
exports.default = RegistryManager;
RegistryManager.shaders = new ShaderRegistry_1.default();
/** Additional custom registries to add to the registry manager */
RegistryManager.registries = new Map_1.default();
},{"../DataTypes/Map":8,"./Registries/ShaderRegistry":61}],63:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../../DataTypes/Map"));
const Emitter_1 = __importDefault(require("../../Events/Emitter"));
const AnimationTypes_1 = require("./AnimationTypes");
/**
 * An animation manager class for an animated CanvasNode.
 * This class keeps track of the possible animations, as well as the current animation state,
 * and abstracts all interactions with playing, pausing, and stopping animations as well as
 * creating new animations from the CanvasNode.
 */
class AnimationManager {
    /**
     * Creates a new AnimationManager
     * @param owner The owner of the AnimationManager
     */
    constructor(owner) {
        this.owner = owner;
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
        this.currentAnimation = "";
        this.currentFrame = 0;
        this.frameProgress = 0;
        this.loop = false;
        this.animations = new Map_1.default();
        this.onEndEvent = null;
        this.emitter = new Emitter_1.default();
    }
    /**
     * Add an animation to this sprite
     * @param key The unique key of the animation
     * @param animation The animation data
     */
    add(key, animation) {
        this.animations.add(key, animation);
    }
    /**
     * Gets the index specified by the current animation and current frame
     * @returns The index in the current animation
     */
    getIndex() {
        if (this.animations.has(this.currentAnimation)) {
            return this.animations.get(this.currentAnimation).frames[this.currentFrame].index;
        }
        else {
            // No current animation, warn the user
            console.warn(`Animation index was requested, but the current animation: ${this.currentAnimation} was invalid`);
            return 0;
        }
    }
    /**
     * Determines whether the specified animation is currently playing
     * @param key The key of the animation to check
     * @returns true if the specified animation is playing, false otherwise
     */
    isPlaying(key) {
        return this.currentAnimation === key && this.animationState === AnimationTypes_1.AnimationState.PLAYING;
    }
    /**
     * Retrieves the current animation index and advances the animation frame
     * @returns The index of the animation frame
     */
    getIndexAndAdvanceAnimation() {
        // If we aren't playing, we won't be advancing the animation
        if (!(this.animationState === AnimationTypes_1.AnimationState.PLAYING)) {
            return this.getIndex();
        }
        if (this.animations.has(this.currentAnimation)) {
            let currentAnimation = this.animations.get(this.currentAnimation);
            let index = currentAnimation.frames[this.currentFrame].index;
            // Advance the animation
            this.frameProgress += 1;
            if (this.frameProgress >= currentAnimation.frames[this.currentFrame].duration) {
                // We have been on this frame for its whole duration, go to the next one
                this.frameProgress = 0;
                this.currentFrame += 1;
                if (this.currentFrame >= currentAnimation.frames.length) {
                    // We have reached the end of this animation
                    if (this.loop) {
                        this.currentFrame = 0;
                        this.frameProgress = 0;
                    }
                    else {
                        this.endCurrentAnimation();
                    }
                }
            }
            // Return the current index
            return index;
        }
        else {
            // No current animation, can't advance. Warn the user
            console.warn(`Animation index and advance was requested, but the current animation (${this.currentAnimation}) in node with id: ${this.owner.id} was invalid`);
            return 0;
        }
    }
    /** Ends the current animation and fires any necessary events, as well as starting any new animations */
    endCurrentAnimation() {
        this.currentFrame = 0;
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
        if (this.onEndEvent !== null) {
            this.emitter.fireEvent(this.onEndEvent, {
                owner: this.owner.id,
                animation: this.currentAnimation,
            });
        }
        // If there is a pending animation, play it
        if (this.pendingAnimation !== null) {
            this.play(this.pendingAnimation, this.pendingLoop, this.pendingOnEnd);
        }
    }
    /**
     * Plays the specified animation. Does not restart it if it is already playing
     * @param animation The name of the animation to play
     * @param loop Whether or not to loop the animation. False by default
     * @param onEnd The name of an event to send when this animation naturally stops playing. This only matters if loop is false.
     */
    playIfNotAlready(animation, loop, onEnd) {
        if (this.currentAnimation !== animation) {
            this.play(animation, loop, onEnd);
        }
    }
    /**
     * Plays the specified animation
     * @param animation The name of the animation to play
     * @param loop Whether or not to loop the animation. False by default
     * @param onEnd The name of an event to send when this animation naturally stops playing. This only matters if loop is false.
     */
    play(animation, loop, onEnd) {
        this.currentAnimation = animation;
        this.currentFrame = 0;
        this.frameProgress = 0;
        this.animationState = AnimationTypes_1.AnimationState.PLAYING;
        // If loop arg was provided, use that
        if (loop !== undefined) {
            this.loop = loop;
        }
        else {
            // Otherwise, use what the json file specified
            this.loop = this.animations.get(animation).repeat;
        }
        if (onEnd !== undefined) {
            this.onEndEvent = onEnd;
        }
        else {
            this.onEndEvent = null;
        }
        // Reset pending animation
        this.pendingAnimation = null;
    }
    /**
     * Queues a single animation to be played after the current one. Does NOT stack.
     * Queueing additional animations past 1 will just replace the queued animation
     * @param animation The animation to queue
     * @param loop Whether or not the loop the queued animation
     * @param onEnd The event to fire when the queued animation ends
     */
    queue(animation, loop = false, onEnd) {
        this.pendingAnimation = animation;
        this.pendingLoop = loop;
        if (onEnd !== undefined) {
            this.pendingOnEnd = onEnd;
        }
        else {
            this.pendingOnEnd = null;
        }
    }
    /** Pauses the current animation */
    pause() {
        this.animationState = AnimationTypes_1.AnimationState.PAUSED;
    }
    /** Resumes the current animation if possible */
    resume() {
        if (this.animationState === AnimationTypes_1.AnimationState.PAUSED) {
            this.animationState = AnimationTypes_1.AnimationState.PLAYING;
        }
    }
    /** Stops the current animation. The animation cannot be resumed after this. */
    stop() {
        this.animationState = AnimationTypes_1.AnimationState.STOPPED;
    }
    getCurrent() {
        return this.currentAnimation;
    }
    getPending() {
        return this.pendingAnimation;
    }
}
exports.default = AnimationManager;
},{"../../DataTypes/Map":8,"../../Events/Emitter":24,"./AnimationTypes":64}],64:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweenData = exports.TweenEffect = exports.AnimationData = exports.AnimationState = void 0;
// @ignorePage
var AnimationState;
(function (AnimationState) {
    AnimationState[AnimationState["STOPPED"] = 0] = "STOPPED";
    AnimationState[AnimationState["PAUSED"] = 1] = "PAUSED";
    AnimationState[AnimationState["PLAYING"] = 2] = "PLAYING";
})(AnimationState = exports.AnimationState || (exports.AnimationState = {}));
class AnimationData {
    constructor() {
        this.repeat = false;
    }
}
exports.AnimationData = AnimationData;
class TweenEffect {
}
exports.TweenEffect = TweenEffect;
class TweenData {
}
exports.TweenData = TweenData;
},{}],65:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const GraphicTypes_1 = require("../../Nodes/Graphics/GraphicTypes");
const Timer_1 = __importDefault(require("../../Timing/Timer"));
const Color_1 = __importDefault(require("../../Utils/Color"));
const MathUtils_1 = __importDefault(require("../../Utils/MathUtils"));
const RandUtils_1 = __importDefault(require("../../Utils/RandUtils"));
const ParticleSystemManager_1 = __importDefault(require("./ParticleSystemManager"));
class ParticleSystem {
    /**
     * Construct a particle system
     *
     * @param poolSize The pool size, i.e the total number of particles that will be created
     * @param sourcePoint The initial source point each particle will start at when the system is running, can be changed
     * @param lifetime Lifetime of each particle before they are set inactive
     * @param size Size of each particle
     * @param mass Initial mass of each particle, can be changed
     * @param maxParticlesPerFrame Total number of particles that can be created during a given frame.
     */
    constructor(poolSize, sourcePoint, lifetime, size, mass, maxParticlesPerFrame) {
        this.color = new Color_1.default(255, 0, 0);
        this.particlePool = new Array(poolSize);
        this.sourcePoint = sourcePoint;
        this.lifetime = lifetime;
        this.particleSize = new Vec2_1.default(size, size);
        this.systemRunning = false;
        this.particlesPerFrame = maxParticlesPerFrame;
        this.particlesToRender = this.particlesPerFrame;
        this.particleMass = mass;
        ParticleSystemManager_1.default.getInstance().registerParticleSystem(this);
    }
    /** Initialize the pool of all particles, creating the assets in advance */
    initializePool(scene, layer) {
        for (let i = 0; i < this.particlePool.length; i++) {
            this.particlePool[i] = scene.add.graphic(GraphicTypes_1.GraphicType.PARTICLE, layer, { position: this.sourcePoint.clone(), size: this.particleSize.clone(), mass: this.particleMass });
            this.particlePool[i].addPhysics();
            this.particlePool[i].isCollidable = false;
            this.particlePool[i].visible = false;
        }
    }
    /**
     * Start up the particle system to run for a set amount of time
     * @param time Time for the particle systme to run
     * @param mass Optional change of mass for each particle
     * @param startPoint Optional change of start position for each particle
     */
    startSystem(time, mass, startPoint) {
        //Stop the system to reset all particles
        this.stopSystem();
        //Set the timer
        this.systemLifetime = new Timer_1.default(time);
        //Update optional parameters
        if (mass !== undefined)
            this.particleMass = mass;
        if (startPoint !== undefined)
            this.sourcePoint = startPoint;
        //Start the timer, set flags, and give the initial amount of particles to render
        this.systemLifetime.start();
        this.systemRunning = true;
        this.particlesToRender = this.particlesPerFrame;
    }
    stopSystem() {
        this.systemRunning = false;
        for (let particle of this.particlePool) {
            if (particle.inUse) {
                particle.setParticleInactive();
            }
        }
    }
    changeColor(color) {
        this.color = color;
    }
    /**
     * Default implementation of setParticleAnimation, no tween animations occur, but each particle is given a random
     * velocity. It's encouraged for you to override this function and implement your own tween animations.
     *
     * @param particle
     */
    setParticleAnimation(particle) {
        particle.vel = RandUtils_1.default.randVec(-50, 50, -100, 100);
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: []
        });
    }
    update(deltaT) {
        // Exit if the system isn't currently running
        if (!this.systemRunning) {
            return;
        }
        // Stop the system if our timer is up
        if (this.systemLifetime.isStopped()) {
            this.stopSystem();
        }
        else {
            for (let i = 0; i < this.particlesToRender; i++) {
                let particle = this.particlePool[i];
                // If a particle is in use, decrease it's age and update it's velocity, if it has one
                if (particle.inUse) {
                    particle.decrementAge(deltaT * 1000);
                    if (particle.age <= 0) {
                        particle.setParticleInactive();
                    }
                    particle.move(particle.vel.scaled(deltaT));
                }
                else {
                    // Set the particle to active
                    particle.setParticleActive(this.lifetime, this.sourcePoint.clone());
                    // Update particle color, mass, and alpha
                    particle.color = this.color;
                    particle.alpha = 1;
                    particle.mass = this.particleMass;
                    // Give particle tween animations
                    this.setParticleAnimation(particle);
                    particle.tweens.play("active");
                }
            }
            // Update the amount of particles that can be rendered based on the particles per frame, clamping if we go over the total number
            // of particles in our pool
            this.particlesToRender = MathUtils_1.default.clamp(this.particlesToRender + this.particlesPerFrame, 0, this.particlePool.length);
        }
    }
}
exports.default = ParticleSystem;
},{"../../DataTypes/Vec2":21,"../../Nodes/Graphics/GraphicTypes":39,"../../Timing/Timer":95,"../../Utils/Color":97,"../../Utils/MathUtils":100,"../../Utils/RandUtils":101,"./ParticleSystemManager":66}],66:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParticleSystemManager {
    constructor() {
        this.particleSystems = new Array();
    }
    static getInstance() {
        if (ParticleSystemManager.instance === null) {
            ParticleSystemManager.instance = new ParticleSystemManager();
        }
        return ParticleSystemManager.instance;
    }
    registerParticleSystem(system) {
        this.particleSystems.push(system);
    }
    deregisterParticleSystem(system) {
        let index = this.particleSystems.indexOf(system);
        this.particleSystems.splice(index, 1);
    }
    clearParticleSystems() {
        this.particleSystems = new Array();
    }
    update(deltaT) {
        for (let particleSystem of this.particleSystems) {
            particleSystem.update(deltaT);
        }
    }
}
exports.default = ParticleSystemManager;
ParticleSystemManager.instance = null;
},{}],67:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../../DataTypes/Map"));
const AnimationTypes_1 = require("./AnimationTypes");
const EaseFunctions_1 = __importDefault(require("../../Utils/EaseFunctions"));
const MathUtils_1 = __importDefault(require("../../Utils/MathUtils"));
const TweenManager_1 = __importDefault(require("./TweenManager"));
const Emitter_1 = __importDefault(require("../../Events/Emitter"));
/**
 * A manager for the tweens of a GameNode.
 * Tweens are short animations played by interpolating between two properties using an easing function.
 * For a good visual representation of easing functions, check out @link(https://easings.net/)(https://easings.net/).
 * Multiple tween can be played at the same time, as long as they don't change the same property.
 * This allows for some interesting polishes or animations that may be very difficult to do with sprite work alone
 * - especially pixel art (such as rotations or scaling).
 */
class TweenController {
    /**
     * Creates a new TweenController
     * @param owner The owner of the TweenController
     */
    constructor(owner) {
        this.owner = owner;
        this.tweens = new Map_1.default();
        this.emitter = new Emitter_1.default();
        // Give ourselves to the TweenManager
        TweenManager_1.default.getInstance().registerTweenController(this);
    }
    /**
     * Destroys this TweenController
     */
    destroy() {
        // Only the gamenode and the tween manager should have a reference to this
        delete this.owner.tweens;
        TweenManager_1.default.getInstance().deregisterTweenController(this);
    }
    /**
     * Add a tween to this game node
     * @param key The name of the tween
     * @param tween The data of the tween
     */
    add(key, tween) {
        let typedTween = tween;
        // Initialize members that we need (and the user didn't provide)
        typedTween.progress = 0;
        typedTween.elapsedTime = 0;
        typedTween.animationState = AnimationTypes_1.AnimationState.STOPPED;
        this.tweens.add(key, typedTween);
    }
    /**
     * Play a tween with a certain name
     * @param key The name of the tween to play
     * @param loop Whether or not the tween should loop
     */
    play(key, loop) {
        if (this.tweens.has(key)) {
            let tween = this.tweens.get(key);
            // Set loop if needed
            if (loop !== undefined) {
                tween.loop = loop;
            }
            // Set the initial values
            for (let effect of tween.effects) {
                if (effect.resetOnComplete) {
                    effect.initialValue = this.owner[effect.property];
                }
            }
            // Start the tween running
            tween.animationState = AnimationTypes_1.AnimationState.PLAYING;
            tween.elapsedTime = 0;
            tween.progress = 0;
            tween.reversing = false;
        }
        else {
            console.warn(`Tried to play tween "${key}" on node with id ${this.owner.id}, but no such tween exists`);
        }
    }
    /**
     * Pauses a playing tween. Does not affect tweens that are stopped.
     * @param key The name of the tween to pause.
     */
    pause(key) {
        if (this.tweens.has(key)) {
            this.tweens.get(key).animationState = AnimationTypes_1.AnimationState.PAUSED;
        }
    }
    /**
     * Resumes a paused tween.
     * @param key The name of the tween to resume
     */
    resume(key) {
        if (this.tweens.has(key)) {
            let tween = this.tweens.get(key);
            if (tween.animationState === AnimationTypes_1.AnimationState.PAUSED)
                tween.animationState = AnimationTypes_1.AnimationState.PLAYING;
        }
    }
    /**
     * Stops a currently playing tween
     * @param key The key of the tween
     */
    stop(key) {
        if (this.tweens.has(key)) {
            let tween = this.tweens.get(key);
            tween.animationState = AnimationTypes_1.AnimationState.STOPPED;
            // Return to the initial values
            for (let effect of tween.effects) {
                if (effect.resetOnComplete) {
                    this.owner[effect.property] = effect.initialValue;
                }
            }
        }
    }
    /**
     * The natural stop of a currently playing tween
     * @param key The key of the tween
     */
    end(key) {
        this.stop(key);
        if (this.tweens.has(key)) {
            // Get the tween
            let tween = this.tweens.get(key);
            // If it has an onEnd, send an event
            if (tween.onEnd) {
                for (let event of tween.onEnd) {
                    this.emitter.fireEvent(event, { key: key, node: this.owner.id });
                }
            }
        }
    }
    /**
     * Stops all currently playing tweens
     */
    stopAll() {
        this.tweens.forEach(key => this.stop(key));
    }
    update(deltaT) {
        this.tweens.forEach(key => {
            let tween = this.tweens.get(key);
            if (tween.animationState === AnimationTypes_1.AnimationState.PLAYING) {
                // Update the progress of the tween
                tween.elapsedTime += deltaT * 1000;
                // If we're past the startDelay, do the tween
                if (tween.elapsedTime >= tween.startDelay) {
                    if (!tween.reversing && tween.elapsedTime >= tween.startDelay + tween.duration) {
                        // If we're over time, stop the tween, loop, or reverse
                        if (tween.reverseOnComplete) {
                            // If we're over time and can reverse, do so
                            tween.reversing = true;
                        }
                        else if (tween.loop) {
                            // If we can't reverse and can loop, do so
                            tween.elapsedTime -= tween.duration;
                        }
                        else {
                            // We aren't looping and can't reverse, so stop
                            this.end(key);
                        }
                    }
                    // Check for the end of reversing
                    if (tween.reversing && tween.elapsedTime >= tween.startDelay + 2 * tween.duration) {
                        if (tween.loop) {
                            tween.reversing = false;
                            tween.elapsedTime -= 2 * tween.duration;
                        }
                        else {
                            this.end(key);
                        }
                    }
                    // Update the progress, make sure it is between 0 and 1. Errors from this should never be large
                    if (tween.reversing) {
                        tween.progress = MathUtils_1.default.clamp01((2 * tween.duration - (tween.elapsedTime - tween.startDelay)) / tween.duration);
                    }
                    else {
                        tween.progress = MathUtils_1.default.clamp01((tween.elapsedTime - tween.startDelay) / tween.duration);
                    }
                    for (let effect of tween.effects) {
                        // Get the value from the ease function that corresponds to our progress
                        let ease = EaseFunctions_1.default[effect.ease](tween.progress);
                        // Use the value to lerp the property
                        let value = MathUtils_1.default.lerp(effect.start, effect.end, ease);
                        // Assign the value of the property
                        this.owner[effect.property] = value;
                    }
                }
            }
        });
    }
}
exports.default = TweenController;
},{"../../DataTypes/Map":8,"../../Events/Emitter":24,"../../Utils/EaseFunctions":98,"../../Utils/MathUtils":100,"./AnimationTypes":64,"./TweenManager":68}],68:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TweenManager {
    constructor() {
        this.tweenControllers = new Array();
    }
    static getInstance() {
        if (TweenManager.instance === null) {
            TweenManager.instance = new TweenManager();
        }
        return TweenManager.instance;
    }
    registerTweenController(controller) {
        this.tweenControllers.push(controller);
    }
    deregisterTweenController(controller) {
        let index = this.tweenControllers.indexOf(controller);
        this.tweenControllers.splice(index, 1);
    }
    clearTweenControllers() {
        this.tweenControllers = new Array();
    }
    update(deltaT) {
        for (let tweenController of this.tweenControllers) {
            tweenController.update(deltaT);
        }
    }
}
exports.default = TweenManager;
TweenManager.instance = null;
},{}],69:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Graphic_1 = __importDefault(require("../Nodes/Graphic"));
const Point_1 = __importDefault(require("../Nodes/Graphics/Point"));
const Rect_1 = __importDefault(require("../Nodes/Graphics/Rect"));
const Sprite_1 = __importDefault(require("../Nodes/Sprites/Sprite"));
const OrthogonalTilemap_1 = __importDefault(require("../Nodes/Tilemaps/OrthogonalTilemap"));
const UIElement_1 = __importDefault(require("../Nodes/UIElement"));
const GraphicRenderer_1 = __importDefault(require("./CanvasRendering/GraphicRenderer"));
const RenderingManager_1 = __importDefault(require("./RenderingManager"));
const TilemapRenderer_1 = __importDefault(require("./CanvasRendering/TilemapRenderer"));
const UIElementRenderer_1 = __importDefault(require("./CanvasRendering/UIElementRenderer"));
const Label_1 = __importDefault(require("../Nodes/UIElements/Label"));
const Button_1 = __importDefault(require("../Nodes/UIElements/Button"));
const Slider_1 = __importDefault(require("../Nodes/UIElements/Slider"));
const TextInput_1 = __importDefault(require("../Nodes/UIElements/TextInput"));
const AnimatedSprite_1 = __importDefault(require("../Nodes/Sprites/AnimatedSprite"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const Line_1 = __importDefault(require("../Nodes/Graphics/Line"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
/**
 * An implementation of the RenderingManager class using CanvasRenderingContext2D.
 */
class CanvasRenderer extends RenderingManager_1.default {
    constructor() {
        super();
    }
    // @override
    setScene(scene) {
        this.scene = scene;
        this.graphicRenderer.setScene(scene);
        this.tilemapRenderer.setScene(scene);
        this.uiElementRenderer.setScene(scene);
    }
    // @override
    initializeCanvas(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.worldSize = new Vec2_1.default(width, height);
        this.ctx = canvas.getContext("2d");
        this.graphicRenderer = new GraphicRenderer_1.default(this.ctx);
        this.tilemapRenderer = new TilemapRenderer_1.default(this.ctx);
        this.uiElementRenderer = new UIElementRenderer_1.default(this.ctx);
        // For crisp pixel art
        this.ctx.imageSmoothingEnabled = false;
        return this.ctx;
    }
    // @override
    render(visibleSet, tilemaps, uiLayers) {
        // Sort by depth, then by visible set by y-value
        visibleSet.sort((a, b) => {
            if (a.getLayer().getDepth() === b.getLayer().getDepth()) {
                return (a.boundary.bottom) - (b.boundary.bottom);
            }
            else {
                return a.getLayer().getDepth() - b.getLayer().getDepth();
            }
        });
        let tilemapIndex = 0;
        let tilemapLength = tilemaps.length;
        let visibleSetIndex = 0;
        let visibleSetLength = visibleSet.length;
        while (tilemapIndex < tilemapLength || visibleSetIndex < visibleSetLength) {
            // Check conditions where we've already reached the edge of one list
            if (tilemapIndex >= tilemapLength) {
                // Only render the remaining visible set
                let node = visibleSet[visibleSetIndex++];
                if (node.visible) {
                    this.renderNode(node);
                }
                continue;
            }
            if (visibleSetIndex >= visibleSetLength) {
                // Only render tilemaps
                this.renderTilemap(tilemaps[tilemapIndex++]);
                continue;
            }
            // Render whichever is further down
            if (tilemaps[tilemapIndex].getLayer().getDepth() <= visibleSet[visibleSetIndex].getLayer().getDepth()) {
                this.renderTilemap(tilemaps[tilemapIndex++]);
            }
            else {
                let node = visibleSet[visibleSetIndex++];
                if (node.visible) {
                    this.renderNode(node);
                }
            }
        }
        // Render the uiLayers on top of everything else
        let sortedUILayers = new Array();
        uiLayers.forEach(key => sortedUILayers.push(uiLayers.get(key)));
        sortedUILayers = sortedUILayers.sort((ui1, ui2) => ui1.getDepth() - ui2.getDepth());
        sortedUILayers.forEach(uiLayer => {
            if (!uiLayer.isHidden())
                uiLayer.getItems().forEach(node => {
                    if (node.visible) {
                        this.renderNode(node);
                    }
                });
        });
    }
    /**
     * Renders a specified CanvasNode
     * @param node The CanvasNode to render
     */
    renderNode(node) {
        // Calculate the origin of the viewport according to this sprite
        this.origin = this.scene.getViewTranslation(node);
        // Get the zoom level of the scene
        this.zoom = this.scene.getViewScale();
        // Move the canvas to the position of the node and rotate
        let xScale = 1;
        let yScale = 1;
        if (node instanceof Sprite_1.default) {
            xScale = node.invertX ? -1 : 1;
            yScale = node.invertY ? -1 : 1;
        }
        this.ctx.setTransform(xScale, 0, 0, yScale, (node.position.x - this.origin.x) * this.zoom, (node.position.y - this.origin.y) * this.zoom);
        this.ctx.rotate(-node.rotation);
        let globalAlpha = this.ctx.globalAlpha;
        if (node instanceof Rect_1.default) {
            Debug_1.default.log("node" + node.id, "Node" + node.id + " Alpha: " + node.alpha);
        }
        this.ctx.globalAlpha = node.alpha;
        if (node instanceof AnimatedSprite_1.default) {
            this.renderAnimatedSprite(node);
        }
        else if (node instanceof Sprite_1.default) {
            this.renderSprite(node);
        }
        else if (node instanceof Graphic_1.default) {
            this.renderGraphic(node);
        }
        else if (node instanceof UIElement_1.default) {
            this.renderUIElement(node);
        }
        this.ctx.globalAlpha = globalAlpha;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // @override
    renderSprite(sprite) {
        // Get the image from the resource manager
        let image = this.resourceManager.getImage(sprite.imageId);
        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world
                image draw start -> x, y
                image draw size  -> w, h
        */
        this.ctx.drawImage(image, sprite.imageOffset.x, sprite.imageOffset.y, sprite.size.x, sprite.size.y, (-sprite.size.x * sprite.scale.x / 2) * this.zoom, (-sprite.size.y * sprite.scale.y / 2) * this.zoom, sprite.size.x * sprite.scale.x * this.zoom, sprite.size.y * sprite.scale.y * this.zoom);
    }
    // @override
    renderAnimatedSprite(sprite) {
        // Get the image from the resource manager
        let image = this.resourceManager.getImage(sprite.imageId);
        let animationIndex = sprite.animation.getIndexAndAdvanceAnimation();
        let animationOffset = sprite.getAnimationOffset(animationIndex);
        /*
            Coordinates in the space of the image:
                image crop start -> x, y
                image crop size  -> w, h
            Coordinates in the space of the world (given we moved)
                image draw start -> -w/2, -h/2
                image draw size  -> w, h
        */
        this.ctx.drawImage(image, sprite.imageOffset.x + animationOffset.x, sprite.imageOffset.y + animationOffset.y, sprite.size.x, sprite.size.y, (-sprite.size.x * sprite.scale.x / 2) * this.zoom, (-sprite.size.y * sprite.scale.y / 2) * this.zoom, sprite.size.x * sprite.scale.x * this.zoom, sprite.size.y * sprite.scale.y * this.zoom);
    }
    // @override
    renderGraphic(graphic) {
        if (graphic instanceof Point_1.default) {
            this.graphicRenderer.renderPoint(graphic, this.zoom);
        }
        else if (graphic instanceof Line_1.default) {
            this.graphicRenderer.renderLine(graphic, this.origin, this.zoom);
        }
        else if (graphic instanceof Rect_1.default) {
            this.graphicRenderer.renderRect(graphic, this.zoom);
        }
    }
    // @override
    renderTilemap(tilemap) {
        if (tilemap instanceof OrthogonalTilemap_1.default) {
            this.tilemapRenderer.renderOrthogonalTilemap(tilemap);
        }
    }
    // @override
    renderUIElement(uiElement) {
        if (uiElement instanceof Label_1.default) {
            this.uiElementRenderer.renderLabel(uiElement);
        }
        else if (uiElement instanceof Button_1.default) {
            this.uiElementRenderer.renderButton(uiElement);
        }
        else if (uiElement instanceof Slider_1.default) {
            this.uiElementRenderer.renderSlider(uiElement);
        }
        else if (uiElement instanceof TextInput_1.default) {
            this.uiElementRenderer.renderTextInput(uiElement);
        }
    }
    clear(clearColor) {
        this.ctx.clearRect(0, 0, this.worldSize.x, this.worldSize.y);
        this.ctx.fillStyle = clearColor.toString();
        this.ctx.fillRect(0, 0, this.worldSize.x, this.worldSize.y);
    }
}
exports.default = CanvasRenderer;
},{"../DataTypes/Vec2":21,"../Debug/Debug":22,"../Nodes/Graphic":38,"../Nodes/Graphics/Line":40,"../Nodes/Graphics/Point":42,"../Nodes/Graphics/Rect":43,"../Nodes/Sprites/AnimatedSprite":44,"../Nodes/Sprites/Sprite":45,"../Nodes/Tilemaps/OrthogonalTilemap":47,"../Nodes/UIElement":48,"../Nodes/UIElements/Button":49,"../Nodes/UIElements/Label":50,"../Nodes/UIElements/Slider":51,"../Nodes/UIElements/TextInput":52,"./CanvasRendering/GraphicRenderer":70,"./CanvasRendering/TilemapRenderer":71,"./CanvasRendering/UIElementRenderer":72,"./RenderingManager":73}],70:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
/**
 * A utility class to help the @reference[CanvasRenderer] render @reference[Graphic]s
 */
class GraphicRenderer {
    constructor(ctx) {
        this.resourceManager = ResourceManager_1.default.getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this GraphicRenderer
     * @param scene The current scene
     */
    setScene(scene) {
        this.scene = scene;
    }
    /**
     * Renders a point
     * @param point The point to render
     * @param zoom The zoom level
     */
    renderPoint(point, zoom) {
        this.ctx.fillStyle = point.color.toStringRGBA();
        this.ctx.fillRect((-point.size.x / 2) * zoom, (-point.size.y / 2) * zoom, point.size.x * zoom, point.size.y * zoom);
    }
    renderLine(line, origin, zoom) {
        this.ctx.strokeStyle = line.color.toStringRGBA();
        this.ctx.lineWidth = line.thickness;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo((line.end.x - line.start.x) * zoom, (line.end.y - line.start.y) * zoom);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    /**
     * Renders a rect
     * @param rect The rect to render
     * @param zoom The zoom level
     */
    renderRect(rect, zoom) {
        // Draw the interior of the rect
        if (rect.color.a !== 0) {
            this.ctx.fillStyle = rect.color.toStringRGB();
            this.ctx.fillRect((-rect.size.x / 2) * zoom, (-rect.size.y / 2) * zoom, rect.size.x * zoom, rect.size.y * zoom);
        }
        // Draw the border of the rect if it isn't transparent
        if (rect.borderColor.a !== 0) {
            this.ctx.strokeStyle = rect.getBorderColor().toStringRGB();
            this.ctx.lineWidth = rect.getBorderWidth();
            this.ctx.strokeRect((-rect.size.x / 2) * zoom, (-rect.size.y / 2) * zoom, rect.size.x * zoom, rect.size.y * zoom);
        }
    }
}
exports.default = GraphicRenderer;
},{"../../ResourceManager/ResourceManager":81}],71:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
/**
 * A utility class for the @reference[CanvasRenderer] to render @reference[Tilemap]s
 */
class TilemapRenderer {
    constructor(ctx) {
        this.resourceManager = ResourceManager_1.default.getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this TilemapRenderer
     * @param scene The current scene
     */
    setScene(scene) {
        this.scene = scene;
    }
    /**
     * Renders an orthogonal tilemap
     * @param tilemap The tilemap to render
     */
    renderOrthogonalTilemap(tilemap) {
        let previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = tilemap.getLayer().getAlpha();
        let origin = this.scene.getViewTranslation(tilemap);
        let size = this.scene.getViewport().getHalfSize();
        let zoom = this.scene.getViewScale();
        let bottomRight = origin.clone().add(size.scaled(2 * zoom));
        if (tilemap.visible) {
            let minColRow = tilemap.getColRowAt(origin);
            let maxColRow = tilemap.getColRowAt(bottomRight);
            for (let x = minColRow.x; x <= maxColRow.x; x++) {
                for (let y = minColRow.y; y <= maxColRow.y; y++) {
                    // Get the tile at this position
                    let tile = tilemap.getTileAtRowCol(new Vec2_1.default(x, y));
                    // Extract the rot/flip parameters if there are any
                    const mask = (0xE << 28);
                    const rotFlip = ((mask & tile) >> 28) & 0xF;
                    tile = tile & ~mask;
                    // Find the tileset that owns this tile index and render
                    for (let tileset of tilemap.getTilesets()) {
                        if (tileset.hasTile(tile)) {
                            this.renderTile(tileset, tile, x, y, origin, tilemap.scale, zoom, rotFlip);
                        }
                    }
                }
            }
        }
        this.ctx.globalAlpha = previousAlpha;
    }
    /**
     * Renders a tile
     * @param tileset The tileset this tile belongs to
     * @param tileIndex The index of the tile
     * @param tilemapRow The row of the tile in the tilemap
     * @param tilemapCol The column of the tile in the tilemap
     * @param origin The origin of the viewport
     * @param scale The scale of the tilemap
     * @param zoom The zoom level of the viewport
     */
    renderTile(tileset, tileIndex, tilemapRow, tilemapCol, origin, scale, zoom, rotFlip) {
        let image = this.resourceManager.getImage(tileset.getImageKey());
        // Get the true index
        let index = tileIndex - tileset.getStartIndex();
        // Get the row and col of the tile in image space
        let row = Math.floor(index / tileset.getNumCols());
        let col = index % tileset.getNumCols();
        let width = tileset.getTileSize().x;
        let height = tileset.getTileSize().y;
        // Calculate the position to start a crop in the tileset image
        let left = col * width;
        let top = row * height;
        // Calculate the position in the world to render the tile
        let x = Math.floor(tilemapRow * width * scale.x);
        let y = Math.floor(tilemapCol * height * scale.y);
        let worldX = Math.floor((x - origin.x) * zoom);
        let worldY = Math.floor((y - origin.y) * zoom);
        let worldWidth = Math.ceil(width * scale.x * zoom);
        let worldHeight = Math.ceil(height * scale.y * zoom);
        if (rotFlip !== 0) {
            let scaleX = 1;
            let scaleY = 1;
            let shearX = 0;
            let shearY = 0;
            // Flip on the x-axis
            if (rotFlip & 8) {
                scaleX = -1;
            }
            // Flip on the y-axis
            if (rotFlip & 4) {
                scaleY = -1;
            }
            // Flip over the line y=x
            if (rotFlip & 2) {
                shearX = scaleY;
                shearY = scaleX;
                scaleX = 0;
                scaleY = 0;
            }
            this.ctx.setTransform(scaleX, shearX, shearY, scaleY, worldX + worldWidth / 2, worldY + worldHeight / 2);
            // Render the tile
            this.ctx.drawImage(image, left, top, width, height, -worldWidth / 2, -worldHeight / 2, worldWidth, worldHeight);
            if (rotFlip !== 0) {
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
        else {
            // No rotations, don't do the calculations, just render the tile
            // Render the tile
            this.ctx.drawImage(image, left, top, width, height, worldX, worldY, worldWidth, worldHeight);
        }
    }
}
exports.default = TilemapRenderer;
},{"../../DataTypes/Vec2":21,"../../ResourceManager/ResourceManager":81}],72:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const MathUtils_1 = __importDefault(require("../../Utils/MathUtils"));
/**
 * A utility class to help the @reference[CanvasRenderer] render @reference[UIElement]s
 */
class UIElementRenderer {
    constructor(ctx) {
        this.resourceManager = ResourceManager_1.default.getInstance();
        this.ctx = ctx;
    }
    /**
     * Sets the scene of this UIElementRenderer
     * @param scene The current scene
     */
    setScene(scene) {
        this.scene = scene;
    }
    /**
     * Renders a label
     * @param label The label to render
     */
    renderLabel(label) {
        // If the size is unassigned (by the user or automatically) assign it
        label.handleInitialSizing(this.ctx);
        // Grab the global alpha so we can adjust it for this render
        let previousAlpha = this.ctx.globalAlpha;
        // Get the font and text position in label
        this.ctx.font = label.getFontString();
        let offset = label.calculateTextOffset(this.ctx);
        // Stroke and fill a rounded rect and give it text
        this.ctx.globalAlpha = label.backgroundColor.a;
        this.ctx.fillStyle = label.calculateBackgroundColor().toStringRGBA();
        this.ctx.fillRoundedRect(-label.size.x / 2, -label.size.y / 2, label.size.x, label.size.y, label.borderRadius);
        this.ctx.strokeStyle = label.calculateBorderColor().toStringRGBA();
        this.ctx.globalAlpha = label.borderColor.a;
        this.ctx.lineWidth = label.borderWidth;
        this.ctx.strokeRoundedRect(-label.size.x / 2, -label.size.y / 2, label.size.x, label.size.y, label.borderRadius);
        this.ctx.fillStyle = label.calculateTextColor();
        this.ctx.globalAlpha = label.textColor.a;
        this.ctx.fillText(label.text, offset.x - label.size.x / 2, offset.y - label.size.y / 2);
        this.ctx.globalAlpha = previousAlpha;
    }
    /**
     * Renders a button
     * @param button The button to render
     */
    renderButton(button) {
        this.renderLabel(button);
    }
    /**
     * Renders a slider
     * @param slider The slider to render
     */
    renderSlider(slider) {
        // Grab the global alpha so we can adjust it for this render
        let previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = slider.getLayer().getAlpha();
        // Calcualate the slider size
        let sliderSize = new Vec2_1.default(slider.size.x, 2);
        // Draw the slider
        this.ctx.fillStyle = slider.sliderColor.toString();
        this.ctx.fillRoundedRect(-sliderSize.x / 2, -sliderSize.y / 2, sliderSize.x, sliderSize.y, slider.borderRadius);
        // Calculate the nib size and position
        let x = MathUtils_1.default.lerp(-slider.size.x / 2, slider.size.x / 2, slider.getValue());
        // Draw the nib
        this.ctx.fillStyle = slider.nibColor.toString();
        this.ctx.fillRoundedRect(x - slider.nibSize.x / 2, -slider.nibSize.y / 2, slider.nibSize.x, slider.nibSize.y, slider.borderRadius);
        // Reset the alpha
        this.ctx.globalAlpha = previousAlpha;
    }
    /**
     * Renders a textInput
     * @param textInput The textInput to render
     */
    renderTextInput(textInput) {
        // Show a cursor sometimes
        if (textInput.focused && textInput.cursorCounter % 60 > 30) {
            textInput.text += "|";
        }
        this.renderLabel(textInput);
        if (textInput.focused) {
            if (textInput.cursorCounter % 60 > 30) {
                textInput.text = textInput.text.substring(0, textInput.text.length - 1);
            }
            textInput.cursorCounter += 1;
            if (textInput.cursorCounter >= 60) {
                textInput.cursorCounter = 0;
            }
        }
    }
}
exports.default = UIElementRenderer;
},{"../../DataTypes/Vec2":21,"../../ResourceManager/ResourceManager":81,"../../Utils/MathUtils":100}],73:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
/**
 * An abstract framework to put all rendering in once place in the application
 */
class RenderingManager {
    constructor() {
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    /**
     * Sets the scene currently being rendered
     * @param scene The current Scene
     */
    setScene(scene) {
        this.scene = scene;
    }
}
exports.default = RenderingManager;
},{"../ResourceManager/ResourceManager":81}],74:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const Graphic_1 = __importDefault(require("../Nodes/Graphic"));
const Point_1 = __importDefault(require("../Nodes/Graphics/Point"));
const Rect_1 = __importDefault(require("../Nodes/Graphics/Rect"));
const AnimatedSprite_1 = __importDefault(require("../Nodes/Sprites/AnimatedSprite"));
const Sprite_1 = __importDefault(require("../Nodes/Sprites/Sprite"));
const UIElement_1 = __importDefault(require("../Nodes/UIElement"));
const Label_1 = __importDefault(require("../Nodes/UIElements/Label"));
const ShaderRegistry_1 = __importDefault(require("../Registry/Registries/ShaderRegistry"));
const RegistryManager_1 = __importDefault(require("../Registry/RegistryManager"));
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
const ParallaxLayer_1 = __importDefault(require("../Scene/Layers/ParallaxLayer"));
const RenderingManager_1 = __importDefault(require("./RenderingManager"));
class WebGLRenderer extends RenderingManager_1.default {
    initializeCanvas(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.worldSize = Vec2_1.default.ZERO;
        this.worldSize.x = width;
        this.worldSize.y = height;
        // Get the WebGL context
        this.gl = canvas.getContext("webgl");
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.CULL_FACE);
        // Tell the resource manager we're using WebGL
        ResourceManager_1.default.getInstance().useWebGL(true, this.gl);
        // Show the text canvas and get its context
        let textCanvas = document.getElementById("text-canvas");
        textCanvas.hidden = false;
        this.textCtx = textCanvas.getContext("2d");
        // Size the text canvas to be the same as the game canvas
        textCanvas.height = height;
        textCanvas.width = width;
        return this.gl;
    }
    render(visibleSet, tilemaps, uiLayers) {
        for (let node of visibleSet) {
            this.renderNode(node);
        }
        uiLayers.forEach(key => {
            if (!uiLayers.get(key).isHidden())
                uiLayers.get(key).getItems().forEach(node => this.renderNode(node));
        });
    }
    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.textCtx.clearRect(0, 0, this.worldSize.x, this.worldSize.y);
    }
    renderNode(node) {
        // Calculate the origin of the viewport according to this sprite
        this.origin = this.scene.getViewTranslation(node);
        // Get the zoom level of the scene
        this.zoom = this.scene.getViewScale();
        if (node.hasCustomShader) {
            // If the node has a custom shader, render using that
            this.renderCustom(node);
        }
        else if (node instanceof Graphic_1.default) {
            this.renderGraphic(node);
        }
        else if (node instanceof Sprite_1.default) {
            if (node instanceof AnimatedSprite_1.default) {
                this.renderAnimatedSprite(node);
            }
            else {
                this.renderSprite(node);
            }
        }
        else if (node instanceof UIElement_1.default) {
            this.renderUIElement(node);
        }
    }
    renderSprite(sprite) {
        let shader = RegistryManager_1.default.shaders.get(ShaderRegistry_1.default.SPRITE_SHADER);
        let options = this.addOptions(shader.getOptions(sprite), sprite);
        shader.render(this.gl, options);
    }
    renderAnimatedSprite(sprite) {
        let shader = RegistryManager_1.default.shaders.get(ShaderRegistry_1.default.SPRITE_SHADER);
        let options = this.addOptions(shader.getOptions(sprite), sprite);
        shader.render(this.gl, options);
    }
    renderGraphic(graphic) {
        if (graphic instanceof Point_1.default) {
            let shader = RegistryManager_1.default.shaders.get(ShaderRegistry_1.default.POINT_SHADER);
            let options = this.addOptions(shader.getOptions(graphic), graphic);
            shader.render(this.gl, options);
        }
        else if (graphic instanceof Rect_1.default) {
            let shader = RegistryManager_1.default.shaders.get(ShaderRegistry_1.default.RECT_SHADER);
            let options = this.addOptions(shader.getOptions(graphic), graphic);
            shader.render(this.gl, options);
        }
    }
    renderTilemap(tilemap) {
        throw new Error("Method not implemented.");
    }
    renderUIElement(uiElement) {
        if (uiElement instanceof Label_1.default) {
            let shader = RegistryManager_1.default.shaders.get(ShaderRegistry_1.default.LABEL_SHADER);
            let options = this.addOptions(shader.getOptions(uiElement), uiElement);
            shader.render(this.gl, options);
            this.textCtx.setTransform(1, 0, 0, 1, (uiElement.position.x - this.origin.x) * this.zoom, (uiElement.position.y - this.origin.y) * this.zoom);
            this.textCtx.rotate(-uiElement.rotation);
            let globalAlpha = this.textCtx.globalAlpha;
            this.textCtx.globalAlpha = uiElement.alpha;
            // Render text
            this.textCtx.font = uiElement.getFontString();
            let offset = uiElement.calculateTextOffset(this.textCtx);
            this.textCtx.fillStyle = uiElement.calculateTextColor();
            this.textCtx.globalAlpha = uiElement.textColor.a;
            this.textCtx.fillText(uiElement.text, offset.x - uiElement.size.x / 2, offset.y - uiElement.size.y / 2);
            this.textCtx.globalAlpha = globalAlpha;
            this.textCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    renderCustom(node) {
        let shader = RegistryManager_1.default.shaders.get(node.customShaderKey);
        let options = this.addOptions(shader.getOptions(node), node);
        shader.render(this.gl, options);
    }
    addOptions(options, node) {
        // Give the shader access to the world size
        options.worldSize = this.worldSize;
        // Adjust the origin position to the parallax
        let layer = node.getLayer();
        let parallax = new Vec2_1.default(1, 1);
        if (layer instanceof ParallaxLayer_1.default) {
            parallax = layer.parallax;
        }
        options.origin = this.origin.clone().mult(parallax);
        return options;
    }
}
exports.default = WebGLRenderer;
},{"../DataTypes/Vec2":21,"../Nodes/Graphic":38,"../Nodes/Graphics/Point":42,"../Nodes/Graphics/Rect":43,"../Nodes/Sprites/AnimatedSprite":44,"../Nodes/Sprites/Sprite":45,"../Nodes/UIElement":48,"../Nodes/UIElements/Label":50,"../Registry/Registries/ShaderRegistry":61,"../Registry/RegistryManager":62,"../ResourceManager/ResourceManager":81,"../Scene/Layers/ParallaxLayer":89,"./RenderingManager":73}],75:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
/**
 * A wrapper class for WebGL shaders.
 * This class is a singleton, and there is only one for each shader type.
 * All objects that use this shader type will refer to and modify this same type.
 */
class ShaderType {
    constructor(programKey) {
        this.programKey = programKey;
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    /**
     * Extracts the options from the CanvasNode and gives them to the render function
     * @param node The node to get options from
     * @returns An object containing the options that should be passed to the render function
     */
    getOptions(node) { return {}; }
}
exports.default = ShaderType;
},{"../../ResourceManager/ResourceManager":81}],76:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mat4x4_1 = __importDefault(require("../../../DataTypes/Mat4x4"));
const Vec2_1 = __importDefault(require("../../../DataTypes/Vec2"));
const ResourceManager_1 = __importDefault(require("../../../ResourceManager/ResourceManager"));
const QuadShaderType_1 = __importDefault(require("./QuadShaderType"));
/** */
class LabelShaderType extends QuadShaderType_1.default {
    constructor(programKey) {
        super(programKey);
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    initBufferObject() {
        this.bufferObjectKey = "label";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    }
    render(gl, options) {
        const backgroundColor = options.backgroundColor.toWebGL();
        const borderColor = options.borderColor.toWebGL();
        const program = this.resourceManager.getShaderProgram(this.programKey);
        const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        const vertexData = this.getVertices(options.size.x, options.size.y);
        const FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        const a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        const u_BackgroundColor = gl.getUniformLocation(program, "u_BackgroundColor");
        gl.uniform4fv(u_BackgroundColor, backgroundColor);
        const u_BorderColor = gl.getUniformLocation(program, "u_BorderColor");
        gl.uniform4fv(u_BorderColor, borderColor);
        const u_MaxSize = gl.getUniformLocation(program, "u_MaxSize");
        gl.uniform2f(u_MaxSize, -vertexData[0], vertexData[1]);
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        let maxDimension = Math.max(options.size.x, options.size.y);
        const u_BorderWidth = gl.getUniformLocation(program, "u_BorderWidth");
        gl.uniform1f(u_BorderWidth, options.borderWidth / maxDimension);
        const u_BorderRadius = gl.getUniformLocation(program, "u_BorderRadius");
        gl.uniform1f(u_BorderRadius, options.borderRadius / maxDimension);
        // The size of the rendering space will be a square with this maximum dimension
        let size = new Vec2_1.default(maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        const translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        const translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        let transformation = Mat4x4_1.default.MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        const u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    getVertices(w, h) {
        let x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        return new Float32Array([
            -x, y,
            -x, -y,
            x, y,
            x, -y
        ]);
    }
    getOptions(rect) {
        let options = {
            position: rect.position,
            backgroundColor: rect.calculateBackgroundColor(),
            borderColor: rect.calculateBorderColor(),
            borderWidth: rect.borderWidth,
            borderRadius: rect.borderRadius,
            size: rect.size,
            rotation: rect.rotation
        };
        return options;
    }
}
exports.default = LabelShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":21,"../../../ResourceManager/ResourceManager":81,"./QuadShaderType":78}],77:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RenderingUtils_1 = __importDefault(require("../../../Utils/RenderingUtils"));
const ShaderType_1 = __importDefault(require("../ShaderType"));
class PointShaderType extends ShaderType_1.default {
    constructor(programKey) {
        super(programKey);
    }
    initBufferObject() {
        this.bufferObjectKey = "point";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    }
    render(gl, options) {
        let position = RenderingUtils_1.default.toWebGLCoords(options.position, options.origin, options.worldSize);
        let color = RenderingUtils_1.default.toWebGLColor(options.color);
        const program = this.resourceManager.getShaderProgram(this.programKey);
        const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        const vertexData = position;
        const FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        const a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        const u_Color = gl.getUniformLocation(program, "u_Color");
        gl.uniform4fv(u_Color, color);
        const u_PointSize = gl.getUniformLocation(program, "u_PointSize");
        gl.uniform1f(u_PointSize, options.pointSize);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    getOptions(point) {
        let options = {
            position: point.position,
            color: point.color,
            pointSize: point.size,
        };
        return options;
    }
}
exports.default = PointShaderType;
},{"../../../Utils/RenderingUtils":103,"../ShaderType":75}],78:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mat4x4_1 = __importDefault(require("../../../DataTypes/Mat4x4"));
const ShaderType_1 = __importDefault(require("../ShaderType"));
/** Represents any WebGL objects that have a quad mesh (i.e. a rectangular game object composed of only two triangles) */
class QuadShaderType extends ShaderType_1.default {
    constructor(programKey) {
        super(programKey);
        this.scale = Mat4x4_1.default.IDENTITY;
        this.rotation = Mat4x4_1.default.IDENTITY;
        this.translation = Mat4x4_1.default.IDENTITY;
    }
}
exports.default = QuadShaderType;
},{"../../../DataTypes/Mat4x4":9,"../ShaderType":75}],79:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mat4x4_1 = __importDefault(require("../../../DataTypes/Mat4x4"));
const Vec2_1 = __importDefault(require("../../../DataTypes/Vec2"));
const ResourceManager_1 = __importDefault(require("../../../ResourceManager/ResourceManager"));
const QuadShaderType_1 = __importDefault(require("./QuadShaderType"));
/** */
class RectShaderType extends QuadShaderType_1.default {
    constructor(programKey) {
        super(programKey);
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    initBufferObject() {
        this.bufferObjectKey = "rect";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    }
    render(gl, options) {
        const color = options.color.toWebGL();
        const program = this.resourceManager.getShaderProgram(this.programKey);
        const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        gl.useProgram(program);
        const vertexData = this.getVertices(options.size.x, options.size.y);
        const FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        const a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        // Uniforms
        const u_Color = gl.getUniformLocation(program, "u_Color");
        gl.uniform4fv(u_Color, color);
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        let maxDimension = Math.max(options.size.x, options.size.y);
        // The size of the rendering space will be a square with this maximum dimension
        let size = new Vec2_1.default(maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        const translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        const translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        let transformation = Mat4x4_1.default.MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        const u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    /*
        So as it turns out, WebGL has an issue with non-square quads.
        It doesn't like when you don't have a 1-1 scale, and rotations are entirely messed up if this is not the case.
        To solve this, I used the scale of the LARGEST dimension of the quad to make a square, then adjusted the vertex coordinates inside of that.
        A diagram of the solution follows.

        There is a bounding square for the quad with dimensions hxh (in this case, since height is the largest dimension).
        The offset in the vertical direction is therefore 0.5, as it is normally.
        However, the offset in the horizontal direction is not so straightforward, but isn't conceptually hard.
        All we really have to do is a range change from [0, height/2] to [0, 0.5], where our value is t = width/2, and 0 <= t <= height/2.

        So now we have our rect, in a space scaled with respect to the largest dimension.
        Rotations work as you would expect, even for long rectangles.

                    0.5
            __ __ __ __ __ __ __
            |	|88888888888|	|
            |	|88888888888|	|
            |	|88888888888|	|
        -0.5|_ _|88888888888|_ _|0.5
            |	|88888888888|	|
            |	|88888888888|	|
            |	|88888888888|	|
            |___|88888888888|___|
                    -0.5

        The getVertices function below does as described, and converts the range
    */
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    getVertices(w, h) {
        let x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        return new Float32Array([
            -x, y,
            -x, -y,
            x, y,
            x, -y
        ]);
    }
    getOptions(rect) {
        let options = {
            position: rect.position,
            color: rect.color,
            size: rect.size,
            rotation: rect.rotation
        };
        return options;
    }
}
exports.default = RectShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":21,"../../../ResourceManager/ResourceManager":81,"./QuadShaderType":78}],80:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mat4x4_1 = __importDefault(require("../../../DataTypes/Mat4x4"));
const Vec2_1 = __importDefault(require("../../../DataTypes/Vec2"));
const AnimatedSprite_1 = __importDefault(require("../../../Nodes/Sprites/AnimatedSprite"));
const ResourceManager_1 = __importDefault(require("../../../ResourceManager/ResourceManager"));
const QuadShaderType_1 = __importDefault(require("./QuadShaderType"));
/** A shader for sprites and animated sprites */
class SpriteShaderType extends QuadShaderType_1.default {
    constructor(programKey) {
        super(programKey);
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    initBufferObject() {
        this.bufferObjectKey = "sprite";
        this.resourceManager.createBuffer(this.bufferObjectKey);
    }
    render(gl, options) {
        const program = this.resourceManager.getShaderProgram(this.programKey);
        const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        const texture = this.resourceManager.getTexture(options.imageKey);
        gl.useProgram(program);
        const vertexData = this.getVertices(options.size.x, options.size.y, options.scale);
        const FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        // Attributes
        const a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        const a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(a_TexCoord);
        // Uniforms
        // Get transformation matrix
        // We want a square for our rendering space, so get the maximum dimension of our quad
        let maxDimension = Math.max(options.size.x, options.size.y);
        // The size of the rendering space will be a square with this maximum dimension
        let size = new Vec2_1.default(maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        const translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        const translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        let transformation = Mat4x4_1.default.MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        const u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Set up our sampler with our assigned texture unit
        const u_Sampler = gl.getUniformLocation(program, "u_Sampler");
        gl.uniform1i(u_Sampler, texture);
        // Pass in texShift
        const u_texShift = gl.getUniformLocation(program, "u_texShift");
        gl.uniform2fv(u_texShift, options.texShift);
        // Pass in texScale
        const u_texScale = gl.getUniformLocation(program, "u_texScale");
        gl.uniform2fv(u_texScale, options.texScale);
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    /**
     * The rendering space always has to be a square, so make sure its square w.r.t to the largest dimension
     * @param w The width of the quad in pixels
     * @param h The height of the quad in pixels
     * @returns An array of the vertices of the quad
     */
    getVertices(w, h, scale) {
        let x, y;
        if (h > w) {
            y = 0.5;
            x = w / (2 * h);
        }
        else {
            x = 0.5;
            y = h / (2 * w);
        }
        // Scale the rendering space if needed
        x *= scale[0];
        y *= scale[1];
        return new Float32Array([
            -x, y, 0.0, 0.0,
            -x, -y, 0.0, 1.0,
            x, y, 1.0, 0.0,
            x, -y, 1.0, 1.0
        ]);
    }
    getOptions(sprite) {
        let texShift;
        let texScale;
        if (sprite instanceof AnimatedSprite_1.default) {
            let animationIndex = sprite.animation.getIndexAndAdvanceAnimation();
            let offset = sprite.getAnimationOffset(animationIndex);
            texShift = new Float32Array([offset.x / (sprite.cols * sprite.size.x), offset.y / (sprite.rows * sprite.size.y)]);
            texScale = new Float32Array([1 / (sprite.cols), 1 / (sprite.rows)]);
        }
        else {
            texShift = new Float32Array([0, 0]);
            texScale = new Float32Array([1, 1]);
        }
        let options = {
            position: sprite.position,
            rotation: sprite.rotation,
            size: sprite.size,
            scale: sprite.scale.toArray(),
            imageKey: sprite.imageId,
            texShift,
            texScale
        };
        return options;
    }
}
exports.default = SpriteShaderType;
},{"../../../DataTypes/Mat4x4":9,"../../../DataTypes/Vec2":21,"../../../Nodes/Sprites/AnimatedSprite":44,"../../../ResourceManager/ResourceManager":81,"./QuadShaderType":78}],81:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Map_1 = __importDefault(require("../DataTypes/Map"));
const Queue_1 = __importDefault(require("../DataTypes/Queue"));
const StringUtils_1 = __importDefault(require("../Utils/StringUtils"));
const AudioManager_1 = __importDefault(require("../Sound/AudioManager"));
const WebGLProgramType_1 = __importDefault(require("../DataTypes/Rendering/WebGLProgramType"));
/**
 * The resource manager for the game engine.
 * The resource manager interfaces with the loadable assets of a game such as images, data files,
 * and sounds, which are all found in the dist folder.
 * This class controls loading and updates the @reference[Scene] with the loading progress, so that the scene does
 * not start before all necessary assets are loaded.
 */
class ResourceManager {
    constructor() {
        this.loading = false;
        this.justLoaded = false;
        this.loadonly_imagesLoaded = 0;
        this.loadonly_imagesToLoad = 0;
        this.loadonly_imageLoadingQueue = new Queue_1.default();
        this.images = new Map_1.default();
        this.loadonly_spritesheetsLoaded = 0;
        this.loadonly_spritesheetsToLoad = 0;
        this.loadonly_spritesheetLoadingQueue = new Queue_1.default();
        this.spritesheets = new Map_1.default();
        this.loadonly_tilemapsLoaded = 0;
        this.loadonly_tilemapsToLoad = 0;
        this.loadonly_tilemapLoadingQueue = new Queue_1.default();
        this.tilemaps = new Map_1.default();
        this.loadonly_audioLoaded = 0;
        this.loadonly_audioToLoad = 0;
        this.loadonly_audioLoadingQueue = new Queue_1.default();
        this.audioBuffers = new Map_1.default();
        this.loadonly_jsonLoaded = 0;
        this.loadonly_jsonToLoad = 0;
        this.loadonly_jsonLoadingQueue = new Queue_1.default();
        this.jsonObjects = new Map_1.default();
        this.loadonly_gl_ShaderProgramsLoaded = 0;
        this.loadonly_gl_ShaderProgramsToLoad = 0;
        this.loadonly_gl_ShaderLoadingQueue = new Queue_1.default();
        this.gl_ShaderPrograms = new Map_1.default();
        this.gl_Textures = new Map_1.default();
        this.gl_NextTextureID = 0;
        this.gl_Buffers = new Map_1.default();
        this.resourcesToUnload = new Array();
        this.resourcesToKeep = new Array();
    }
    ;
    /* ######################################## SINGLETON ########################################*/
    /**
     * Returns the current instance of this class or a new instance if none exist
     * @returns The resource manager
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new ResourceManager();
        }
        return this.instance;
    }
    /* ######################################## PUBLIC FUNCTION ########################################*/
    /**
     * Activates or deactivates the use of WebGL
     * @param flag True if WebGL should be used, false otherwise
     * @param gl The instance of the graphics context, if applicable
     */
    useWebGL(flag, gl) {
        this.gl_WebGLActive = flag;
        if (this.gl_WebGLActive) {
            this.gl = gl;
        }
    }
    /**
     * Loads an image from file
     * @param key The key to associate the loaded image with
     * @param path The path to the image to load
     */
    image(key, path) {
        this.loadonly_imageLoadingQueue.enqueue({ key: key, path: path });
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepImage(key) {
        this.keepResource(key, ResourceType.IMAGE);
    }
    /**
     * Retrieves a loaded image
     * @param key The key of the loaded image
     * @returns The image element associated with this key
     */
    getImage(key) {
        let image = this.images.get(key);
        if (image === undefined) {
            throw `There is no image associated with key "${key}"`;
        }
        return image;
    }
    /**
     * Loads a spritesheet from file
     * @param key The key to associate the loaded spritesheet with
     * @param path The path to the spritesheet to load
     */
    spritesheet(key, path) {
        this.loadonly_spritesheetLoadingQueue.enqueue({ key: key, path: path });
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepSpritesheet(key) {
        this.keepResource(key, ResourceType.SPRITESHEET);
    }
    /**
     * Retrieves a loaded spritesheet
     * @param key The key of the spritesheet to load
     * @returns The loaded Spritesheet
     */
    getSpritesheet(key) {
        return this.spritesheets.get(key);
    }
    /**
     * Loads an audio file
     * @param key The key to associate with the loaded audio file
     * @param path The path to the audio file to load
     */
    audio(key, path) {
        this.loadonly_audioLoadingQueue.enqueue({ key: key, path: path });
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepAudio(key) {
        this.keepResource(key, ResourceType.AUDIO);
    }
    /**
     * Retrieves a loaded audio file
     * @param key The key of the audio file to load
     * @returns The AudioBuffer created from the loaded audio fle
     */
    getAudio(key) {
        return this.audioBuffers.get(key);
    }
    /**
     * Load a tilemap from a json file. Automatically loads related images
     * @param key The key to associate with the loaded tilemap
     * @param path The path to the tilemap to load
     */
    tilemap(key, path) {
        this.loadonly_tilemapLoadingQueue.enqueue({ key: key, path: path });
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepTilemap(key) {
        this.keepResource(key, ResourceType.TILEMAP);
    }
    /**
     * Retreives a loaded tilemap
     * @param key The key of the loaded tilemap
     * @returns The tilemap data associated with the key
     */
    getTilemap(key) {
        return this.tilemaps.get(key);
    }
    /**
     * Loads an object from a json file.
     * @param key The key to associate with the loaded object
     * @param path The path to the json file to load
     */
    object(key, path) {
        this.loadonly_jsonLoadingQueue.enqueue({ key: key, path: path });
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepObject(key) {
        this.keepResource(key, ResourceType.JSON);
    }
    /**
     * Retreives a loaded object
     * @param key The key of the loaded object
     * @returns The object data associated with the key
     */
    getObject(key) {
        return this.jsonObjects.get(key);
    }
    /* ######################################## LOAD FUNCTION ########################################*/
    /**
     * Loads all resources currently in the queue
     * @param callback The function to cal when the resources are finished loading
     */
    loadResourcesFromQueue(callback) {
        this.loadonly_typesToLoad = 5;
        this.loading = true;
        // Load everything in the queues. Tilemaps have to come before images because they will add new images to the queue
        this.loadTilemapsFromQueue(() => {
            console.log("Loaded Tilemaps");
            this.loadSpritesheetsFromQueue(() => {
                console.log("Loaded Spritesheets");
                this.loadImagesFromQueue(() => {
                    console.log("Loaded Images");
                    this.loadAudioFromQueue(() => {
                        console.log("Loaded Audio");
                        this.loadObjectsFromQueue(() => {
                            console.log("Loaded Objects");
                            if (this.gl_WebGLActive) {
                                this.gl_LoadShadersFromQueue(() => {
                                    console.log("Loaded Shaders");
                                    this.finishLoading(callback);
                                });
                            }
                            else {
                                this.finishLoading(callback);
                            }
                        });
                    });
                });
            });
        });
    }
    finishLoading(callback) {
        // Done loading
        this.loading = false;
        this.justLoaded = true;
        callback();
    }
    /* ######################################## UNLOAD FUNCTION ########################################*/
    keepResource(key, type) {
        console.log("Keep resource...");
        for (let i = 0; i < this.resourcesToUnload.length; i++) {
            let resource = this.resourcesToUnload[i];
            if (resource.key === key && resource.resourceType === type) {
                console.log("Found resource " + key + " of type " + type + ". Keeping.");
                let resourceToMove = this.resourcesToUnload.splice(i, 1);
                this.resourcesToKeep.push(...resourceToMove);
                return;
            }
        }
    }
    /**
     * Deletes references to all resources in the resource manager
     */
    unloadAllResources() {
        this.loading = false;
        this.justLoaded = false;
        for (let resource of this.resourcesToUnload) {
            // Unload the resource
            this.unloadResource(resource);
        }
    }
    unloadResource(resource) {
        // Delete the resource itself
        switch (resource.resourceType) {
            case ResourceType.IMAGE:
                this.images.delete(resource.key);
                if (this.gl_WebGLActive) {
                    this.gl_Textures.delete(resource.key);
                }
                break;
            case ResourceType.TILEMAP:
                this.tilemaps.delete(resource.key);
                break;
            case ResourceType.SPRITESHEET:
                this.spritesheets.delete(resource.key);
                break;
            case ResourceType.AUDIO:
                this.audioBuffers.delete(resource.key);
                break;
            case ResourceType.JSON:
                this.jsonObjects.delete(resource.key);
                break;
            /*case ResourceType.SHADER:
                this.gl_ShaderPrograms.get(resource.key).delete(this.gl);
                this.gl_ShaderPrograms.delete(resource.key);
                break;*/
        }
        // Delete any dependencies
        for (let dependency of resource.dependencies) {
            this.unloadResource(dependency);
        }
    }
    /* ######################################## WORK FUNCTIONS ########################################*/
    /**
     * Loads all tilemaps currently in the tilemap loading queue
     * @param onFinishLoading The function to call when loading is complete
     */
    loadTilemapsFromQueue(onFinishLoading) {
        this.loadonly_tilemapsToLoad = this.loadonly_tilemapLoadingQueue.getSize();
        this.loadonly_tilemapsLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_tilemapsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_tilemapLoadingQueue.hasItems()) {
            let tilemap = this.loadonly_tilemapLoadingQueue.dequeue();
            this.loadTilemap(tilemap.key, tilemap.path, onFinishLoading);
        }
    }
    /**
     * Loads a singular tilemap
     * @param key The key of the tilemap
     * @param pathToTilemapJSON The path to the tilemap JSON file
     * @param callbackIfLast The function to call if this is the last tilemap to load
     */
    loadTilemap(key, pathToTilemapJSON, callbackIfLast) {
        this.loadTextFile(pathToTilemapJSON, (fileText) => {
            let tilemapObject = JSON.parse(fileText);
            // We can parse the object later - it's much faster than loading
            this.tilemaps.add(key, tilemapObject);
            let resource = new ResourceReference(key, ResourceType.TILEMAP);
            // Grab the tileset images we need to load and add them to the imageloading queue
            for (let tileset of tilemapObject.tilesets) {
                if (tileset.image) {
                    let key = tileset.image;
                    let path = StringUtils_1.default.getPathFromFilePath(pathToTilemapJSON) + key;
                    this.loadonly_imageLoadingQueue.enqueue({ key: key, path: path, isDependency: true });
                    // Add this image as a dependency to the tilemap
                    resource.addDependency(new ResourceReference(key, ResourceType.IMAGE));
                }
                else if (tileset.tiles) {
                    for (let tile of tileset.tiles) {
                        let key = tile.image;
                        let path = StringUtils_1.default.getPathFromFilePath(pathToTilemapJSON) + key;
                        this.loadonly_imageLoadingQueue.enqueue({ key: key, path: path, isDependency: true });
                        // Add this image as a dependency to the tilemap
                        resource.addDependency(new ResourceReference(key, ResourceType.IMAGE));
                    }
                }
            }
            // Add the resource reference to the list of resource to unload
            this.resourcesToUnload.push(resource);
            // Finish loading
            this.finishLoadingTilemap(callbackIfLast);
        });
    }
    /**
     * Finish loading a tilemap. Calls the callback function if this is the last tilemap being loaded
     * @param callback The function to call if this is the last tilemap to load
     */
    finishLoadingTilemap(callback) {
        this.loadonly_tilemapsLoaded += 1;
        if (this.loadonly_tilemapsLoaded === this.loadonly_tilemapsToLoad) {
            // We're done loading tilemaps
            callback();
        }
    }
    /**
     * Loads all spritesheets currently in the spritesheet loading queue
     * @param onFinishLoading The function to call when the spritesheets are done loading
     */
    loadSpritesheetsFromQueue(onFinishLoading) {
        this.loadonly_spritesheetsToLoad = this.loadonly_spritesheetLoadingQueue.getSize();
        this.loadonly_spritesheetsLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_spritesheetsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_spritesheetLoadingQueue.hasItems()) {
            let spritesheet = this.loadonly_spritesheetLoadingQueue.dequeue();
            this.loadSpritesheet(spritesheet.key, spritesheet.path, onFinishLoading);
        }
    }
    /**
     * Loads a singular spritesheet
     * @param key The key of the spritesheet to load
     * @param pathToSpritesheetJSON The path to the spritesheet JSON file
     * @param callbackIfLast The function to call if this is the last spritesheet
     */
    loadSpritesheet(key, pathToSpritesheetJSON, callbackIfLast) {
        this.loadTextFile(pathToSpritesheetJSON, (fileText) => {
            let spritesheet = JSON.parse(fileText);
            // We can parse the object later - it's much faster than loading
            this.spritesheets.add(key, spritesheet);
            let resource = new ResourceReference(key, ResourceType.SPRITESHEET);
            // Grab the image we need to load and add it to the imageloading queue
            let path = StringUtils_1.default.getPathFromFilePath(pathToSpritesheetJSON) + spritesheet.spriteSheetImage;
            this.loadonly_imageLoadingQueue.enqueue({ key: spritesheet.name, path: path, isDependency: true });
            resource.addDependency(new ResourceReference(spritesheet.name, ResourceType.IMAGE));
            this.resourcesToUnload.push(resource);
            // Finish loading
            this.finishLoadingSpritesheet(callbackIfLast);
        });
    }
    /**
     * Finish loading a spritesheet. Calls the callback function if this is the last spritesheet being loaded
     * @param callback The function to call if this is the last spritesheet to load
     */
    finishLoadingSpritesheet(callback) {
        this.loadonly_spritesheetsLoaded += 1;
        if (this.loadonly_spritesheetsLoaded === this.loadonly_spritesheetsToLoad) {
            // We're done loading spritesheets
            callback();
        }
    }
    /**
     * Loads all images currently in the image loading queue
     * @param onFinishLoading The function to call when there are no more images to load
     */
    loadImagesFromQueue(onFinishLoading) {
        this.loadonly_imagesToLoad = this.loadonly_imageLoadingQueue.getSize();
        this.loadonly_imagesLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_imagesToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_imageLoadingQueue.hasItems()) {
            let image = this.loadonly_imageLoadingQueue.dequeue();
            this.loadImage(image.key, image.path, image.isDependency, onFinishLoading);
        }
    }
    /**
     * Loads a singular image
     * @param key The key of the image to load
     * @param path The path to the image to load
     * @param callbackIfLast The function to call if this is the last image
     */
    loadImage(key, path, isDependency, callbackIfLast) {
        var image = new Image();
        image.onload = () => {
            // Add to loaded images
            this.images.add(key, image);
            // If not a dependency, push it to the unload list. Otherwise it's managed by something else
            if (!isDependency) {
                this.resourcesToUnload.push(new ResourceReference(key, ResourceType.IMAGE));
            }
            // If WebGL is active, create a texture
            if (this.gl_WebGLActive) {
                this.createWebGLTexture(key, image);
            }
            // Finish image load
            this.finishLoadingImage(callbackIfLast);
        };
        image.src = path;
    }
    /**
     * Finish loading an image. If this is the last image, it calls the callback function
     * @param callback The function to call if this is the last image
     */
    finishLoadingImage(callback) {
        this.loadonly_imagesLoaded += 1;
        if (this.loadonly_imagesLoaded === this.loadonly_imagesToLoad) {
            // We're done loading images
            callback();
        }
    }
    /**
     * Loads all audio currently in the tilemap loading queue
     * @param onFinishLoading The function to call when tilemaps are done loading
     */
    loadAudioFromQueue(onFinishLoading) {
        this.loadonly_audioToLoad = this.loadonly_audioLoadingQueue.getSize();
        this.loadonly_audioLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_audioToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_audioLoadingQueue.hasItems()) {
            let audio = this.loadonly_audioLoadingQueue.dequeue();
            this.loadAudio(audio.key, audio.path, onFinishLoading);
        }
    }
    /**
     * Load a singular audio file
     * @param key The key to the audio file to load
     * @param path The path to the audio file to load
     * @param callbackIfLast The function to call if this is the last audio file to load
     */
    loadAudio(key, path, callbackIfLast) {
        let audioCtx = AudioManager_1.default.getInstance().getAudioContext();
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            audioCtx.decodeAudioData(request.response, (buffer) => {
                // Add to list of audio buffers
                this.audioBuffers.add(key, buffer);
                this.resourcesToUnload.push(new ResourceReference(key, ResourceType.AUDIO));
                // Finish loading sound
                this.finishLoadingAudio(callbackIfLast);
            }, (error) => {
                throw "Error loading sound";
            });
        };
        request.send();
    }
    /**
     * Finish loading an audio file. Calls the callback functon if this is the last audio sample being loaded.
     * @param callback The function to call if this is the last audio file to load
     */
    finishLoadingAudio(callback) {
        this.loadonly_audioLoaded += 1;
        if (this.loadonly_audioLoaded === this.loadonly_audioToLoad) {
            // We're done loading audio
            callback();
        }
    }
    /**
     * Loads all objects currently in the object loading queue
     * @param onFinishLoading The function to call when there are no more objects to load
     */
    loadObjectsFromQueue(onFinishLoading) {
        this.loadonly_jsonToLoad = this.loadonly_jsonLoadingQueue.getSize();
        this.loadonly_jsonLoaded = 0;
        // If no items to load, we're finished
        if (this.loadonly_jsonToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_jsonLoadingQueue.hasItems()) {
            let obj = this.loadonly_jsonLoadingQueue.dequeue();
            this.loadObject(obj.key, obj.path, onFinishLoading);
        }
    }
    /**
     * Loads a singular object
     * @param key The key of the object to load
     * @param path The path to the object to load
     * @param callbackIfLast The function to call if this is the last object
     */
    loadObject(key, path, callbackIfLast) {
        this.loadTextFile(path, (fileText) => {
            let obj = JSON.parse(fileText);
            this.jsonObjects.add(key, obj);
            this.resourcesToUnload.push(new ResourceReference(key, ResourceType.JSON));
            this.finishLoadingObject(callbackIfLast);
        });
    }
    /**
     * Finish loading an object. If this is the last object, it calls the callback function
     * @param callback The function to call if this is the last object
     */
    finishLoadingObject(callback) {
        this.loadonly_jsonLoaded += 1;
        if (this.loadonly_jsonLoaded === this.loadonly_jsonToLoad) {
            // We're done loading objects
            callback();
        }
    }
    /* ########## WEBGL SPECIFIC FUNCTIONS ########## */
    getTexture(key) {
        return this.gl_Textures.get(key);
    }
    getShaderProgram(key) {
        return this.gl_ShaderPrograms.get(key).program;
    }
    getBuffer(key) {
        return this.gl_Buffers.get(key);
    }
    createWebGLTexture(imageKey, image) {
        // Get the texture ID
        const textureID = this.getTextureID(this.gl_NextTextureID);
        // Create the texture
        const texture = this.gl.createTexture();
        // Set up the texture
        // Enable texture0
        this.gl.activeTexture(textureID);
        // Bind our texture to texture 0
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        // Set the texture parameters
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        // Set the texture image
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        // Add the texture to our map with the same key as the image
        this.gl_Textures.add(imageKey, this.gl_NextTextureID);
        // Increment the key
        this.gl_NextTextureID += 1;
    }
    getTextureID(id) {
        // Start with 9 cases - this can be expanded if needed, but for the best performance,
        // Textures should be stitched into an atlas
        switch (id) {
            case 0: return this.gl.TEXTURE0;
            case 1: return this.gl.TEXTURE1;
            case 2: return this.gl.TEXTURE2;
            case 3: return this.gl.TEXTURE3;
            case 4: return this.gl.TEXTURE4;
            case 5: return this.gl.TEXTURE5;
            case 6: return this.gl.TEXTURE6;
            case 7: return this.gl.TEXTURE7;
            case 8: return this.gl.TEXTURE8;
            default: return this.gl.TEXTURE9;
        }
    }
    createBuffer(key) {
        if (this.gl_WebGLActive) {
            let buffer = this.gl.createBuffer();
            this.gl_Buffers.add(key, buffer);
        }
    }
    /**
     * Enqueues loading of a new shader program
     * @param key The key of the shader program
     * @param vShaderFilepath
     * @param fShaderFilepath
     */
    shader(key, vShaderFilepath, fShaderFilepath) {
        let splitPath = vShaderFilepath.split(".");
        let end = splitPath[splitPath.length - 1];
        if (end !== "vshader") {
            throw `${vShaderFilepath} is not a valid vertex shader - must end in ".vshader`;
        }
        splitPath = fShaderFilepath.split(".");
        end = splitPath[splitPath.length - 1];
        if (end !== "fshader") {
            throw `${fShaderFilepath} is not a valid vertex shader - must end in ".fshader`;
        }
        let paths = new KeyPath_Shader();
        paths.key = key;
        paths.vpath = vShaderFilepath;
        paths.fpath = fShaderFilepath;
        this.loadonly_gl_ShaderLoadingQueue.enqueue(paths);
    }
    /**
     * Tells the resource manager to keep this resource
     * @param key The key of the resource
     */
    keepShader(key) {
        this.keepResource(key, ResourceType.IMAGE);
    }
    gl_LoadShadersFromQueue(onFinishLoading) {
        this.loadonly_gl_ShaderProgramsToLoad = this.loadonly_gl_ShaderLoadingQueue.getSize();
        this.loadonly_gl_ShaderProgramsLoaded = 0;
        // If webGL isn'active or there are no items to load, we're finished
        if (!this.gl_WebGLActive || this.loadonly_gl_ShaderProgramsToLoad === 0) {
            onFinishLoading();
            return;
        }
        while (this.loadonly_gl_ShaderLoadingQueue.hasItems()) {
            let shader = this.loadonly_gl_ShaderLoadingQueue.dequeue();
            this.gl_LoadShader(shader.key, shader.vpath, shader.fpath, onFinishLoading);
        }
    }
    gl_LoadShader(key, vpath, fpath, callbackIfLast) {
        this.loadTextFile(vpath, (vFileText) => {
            const vShader = vFileText;
            this.loadTextFile(fpath, (fFileText) => {
                const fShader = fFileText;
                // Extract the program and shaders
                const [shaderProgram, vertexShader, fragmentShader] = this.createShaderProgram(vShader, fShader);
                // Create a wrapper type
                const programWrapper = new WebGLProgramType_1.default();
                programWrapper.program = shaderProgram;
                programWrapper.vertexShader = vertexShader;
                programWrapper.fragmentShader = fragmentShader;
                // Add to our map
                this.gl_ShaderPrograms.add(key, programWrapper);
                this.resourcesToUnload.push(new ResourceReference(key, ResourceType.SHADER));
                // Finish loading
                this.gl_FinishLoadingShader(callbackIfLast);
            });
        });
    }
    gl_FinishLoadingShader(callback) {
        this.loadonly_gl_ShaderProgramsLoaded += 1;
        if (this.loadonly_gl_ShaderProgramsLoaded === this.loadonly_gl_ShaderProgramsToLoad) {
            // We're done loading shaders
            callback();
        }
    }
    createShaderProgram(vShaderSource, fShaderSource) {
        const vertexShader = this.loadVertexShader(vShaderSource);
        const fragmentShader = this.loadFragmentShader(fShaderSource);
        if (vertexShader === null || fragmentShader === null) {
            // We had a problem intializing - error
            return null;
        }
        // Create a shader program
        const program = this.gl.createProgram();
        if (!program) {
            // Error creating
            console.warn("Failed to create program");
            return null;
        }
        // Attach our vertex and fragment shader
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        // Link
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            // Error linking
            const error = this.gl.getProgramInfoLog(program);
            console.warn("Failed to link program: " + error);
            // Clean up
            this.gl.deleteProgram(program);
            this.gl.deleteShader(vertexShader);
            this.gl.deleteShader(fragmentShader);
            return null;
        }
        // We successfully create a program
        return [program, vertexShader, fragmentShader];
    }
    loadVertexShader(shaderSource) {
        // Create a new vertex shader
        return this.loadShader(this.gl.VERTEX_SHADER, shaderSource);
    }
    loadFragmentShader(shaderSource) {
        // Create a new fragment shader
        return this.loadShader(this.gl.FRAGMENT_SHADER, shaderSource);
    }
    loadShader(type, shaderSource) {
        const shader = this.gl.createShader(type);
        // If we couldn't create the shader, error
        if (shader === null) {
            console.warn("Unable to create shader");
            return null;
        }
        // Add the source to the shader and compile
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        // Make sure there were no errors during this process
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            // Not compiled - error
            const error = this.gl.getShaderInfoLog(shader);
            console.warn("Failed to compile shader: " + error);
            // Clean up
            this.gl.deleteShader(shader);
            return null;
        }
        // Sucess, so return the shader
        return shader;
    }
    /* ########## GENERAL LOADING FUNCTIONS ########## */
    loadTextFile(textFilePath, callback) {
        let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', textFilePath, true);
        xobj.onreadystatechange = function () {
            if ((xobj.readyState == 4) && (xobj.status == 200)) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
    /* ########## LOADING BAR INFO ########## */
    getLoadPercent() {
        return (this.loadonly_tilemapsLoaded / this.loadonly_tilemapsToLoad
            + this.loadonly_spritesheetsLoaded / this.loadonly_spritesheetsToLoad
            + this.loadonly_imagesLoaded / this.loadonly_imagesToLoad
            + this.loadonly_audioLoaded / this.loadonly_audioToLoad)
            / this.loadonly_typesToLoad;
    }
    update(deltaT) {
        if (this.loading) {
            if (this.onLoadProgress) {
                this.onLoadProgress(this.getLoadPercent());
            }
        }
        else if (this.justLoaded) {
            this.justLoaded = false;
            if (this.onLoadComplete) {
                this.onLoadComplete();
            }
        }
    }
}
exports.default = ResourceManager;
/**
 * A class representing a reference to a resource.
 * This is used for the exemption list to assure assets and their dependencies don't get
 * destroyed if they are still needed.
 */
class ResourceReference {
    constructor(key, resourceType) {
        this.key = key;
        this.resourceType = resourceType;
        this.dependencies = new Array();
    }
    addDependency(resource) {
        this.dependencies.push(resource);
    }
}
var ResourceType;
(function (ResourceType) {
    ResourceType["IMAGE"] = "IMAGE";
    ResourceType["TILEMAP"] = "TILEMAP";
    ResourceType["SPRITESHEET"] = "SPRITESHEET";
    ResourceType["AUDIO"] = "AUDIO";
    ResourceType["JSON"] = "JSON";
    ResourceType["SHADER"] = "SHADER";
})(ResourceType || (ResourceType = {}));
/**
 * A pair representing a key and the path of the resource to load
 */
class KeyPathPair {
    constructor() {
        this.isDependency = false;
    }
}
class KeyPath_Shader {
}
},{"../DataTypes/Map":8,"../DataTypes/Queue":12,"../DataTypes/Rendering/WebGLProgramType":13,"../Sound/AudioManager":94,"../Utils/StringUtils":104}],82:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
/**
 * An abstract interface of a SceneGraph.
 * Exposes methods for use by other code, but leaves the implementation up to the subclasses.
 * The SceneGraph manages the positions of all GameNodes, and can easily prune a visible set for rendering.
 */
class SceneGraph {
    /**
     * Creates a new SceneGraph
     * @param viewport The viewport
     * @param scene The Scene this SceneGraph belongs to
     */
    constructor(viewport, scene) {
        this.viewport = viewport;
        this.scene = scene;
        this.nodeMap = new Array();
        this.idCounter = 0;
    }
    /**
     * Add a node to the SceneGraph
     * @param node The CanvasNode to add to the SceneGraph
     * @returns The SceneGraph ID of this newly added CanvasNode
     */
    addNode(node) {
        this.nodeMap[node.id] = node;
        this.addNodeSpecific(node, this.idCounter);
        this.idCounter += 1;
        return this.idCounter - 1;
    }
    ;
    /**
     * Removes a node from the SceneGraph
     * @param node The node to remove
     */
    removeNode(node) {
        // Find and remove node in O(n)
        this.nodeMap[node.id] = undefined;
        this.removeNodeSpecific(node, node.id);
    }
    ;
    /**
     * Get a specific node using its id
     * @param id The id of the CanvasNode to retrieve
     * @returns The node with this ID
     */
    getNode(id) {
        return this.nodeMap[id];
    }
    /**
     * Returns the nodes at specific coordinates
     * @param vecOrX The x-coordinate of the position, or the coordinates in a Vec2
     * @param y The y-coordinate of the position
     * @returns An array of nodes found at the position provided
     */
    getNodesAt(vecOrX, y = null) {
        if (vecOrX instanceof Vec2_1.default) {
            return this.getNodesAtCoords(vecOrX.x, vecOrX.y);
        }
        else {
            return this.getNodesAtCoords(vecOrX, y);
        }
    }
    /**
     * Returns all nodes in the SceneGraph
     * @returns An Array containing all nodes in the SceneGraph
     */
    getAllNodes() {
        let arr = new Array();
        for (let i = 0; i < this.nodeMap.length; i++) {
            if (this.nodeMap[i] !== undefined) {
                arr.push(this.nodeMap[i]);
            }
        }
        return arr;
    }
}
exports.default = SceneGraph;
},{"../DataTypes/Vec2":21}],83:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SceneGraph_1 = __importDefault(require("./SceneGraph"));
const Stats_1 = __importDefault(require("../Debug/Stats"));
/**
 * An implementation of a SceneGraph that simply stored CanvasNodes in an array.
 */
class SceneGraphArray extends SceneGraph_1.default {
    /**
     * Creates a new SceneGraphArray
     * @param viewport The Viewport
     * @param scene The Scene this SceneGraph belongs to
     */
    constructor(viewport, scene) {
        super(viewport, scene);
        this.nodeList = new Array();
    }
    // @override
    addNodeSpecific(node, id) {
        this.nodeList.push(node);
    }
    // @override
    removeNodeSpecific(node, id) {
        let index = this.nodeList.indexOf(node);
        if (index > -1) {
            this.nodeList.splice(index, 1);
        }
    }
    // @override
    getNodesAtCoords(x, y) {
        let results = [];
        for (let node of this.nodeList) {
            if (node.contains(x, y)) {
                results.push(node);
            }
        }
        return results;
    }
    // @override
    getNodesInRegion(boundary) {
        let t0 = performance.now();
        let results = [];
        for (let node of this.nodeList) {
            if (boundary.overlaps(node.boundary)) {
                results.push(node);
            }
        }
        let t1 = performance.now();
        Stats_1.default.log("sgquery", (t1 - t0));
        return results;
    }
    update(deltaT) {
        let t0 = performance.now();
        for (let node of this.nodeList) {
            if (!node.getLayer().isPaused()) {
                node.update(deltaT);
            }
        }
        let t1 = performance.now();
        Stats_1.default.log("sgupdate", (t1 - t0));
    }
    render(ctx) { }
    // @override
    getVisibleSet() {
        let visibleSet = new Array();
        for (let node of this.nodeList) {
            if (!node.getLayer().isHidden() && node.visible && this.viewport.includes(node)) {
                visibleSet.push(node);
            }
        }
        return visibleSet;
    }
}
exports.default = SceneGraphArray;
},{"../Debug/Stats":23,"./SceneGraph":82}],84:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const MathUtils_1 = __importDefault(require("../Utils/MathUtils"));
const Queue_1 = __importDefault(require("../DataTypes/Queue"));
const AABB_1 = __importDefault(require("../DataTypes/Shapes/AABB"));
const Input_1 = __importDefault(require("../Input/Input"));
const ParallaxLayer_1 = __importDefault(require("../Scene/Layers/ParallaxLayer"));
const UILayer_1 = __importDefault(require("../Scene/Layers/UILayer"));
/**
 * The viewport of the game. Corresponds to the visible window displayed in the browser.
 * The viewport keeps track of its position in the game world, and can act as a camera to follow objects.
 */
class Viewport {
    constructor(canvasSize, zoomLevel) {
        /** The amount that is zoomed in or out. */
        this.ZOOM_FACTOR = 1.2;
        this.view = new AABB_1.default(Vec2_1.default.ZERO, Vec2_1.default.ZERO);
        this.boundary = new AABB_1.default(Vec2_1.default.ZERO, Vec2_1.default.ZERO);
        this.lastPositions = new Queue_1.default();
        this.smoothingFactor = 10;
        this.scrollZoomEnabled = false;
        this.canvasSize = Vec2_1.default.ZERO;
        this.focus = Vec2_1.default.ZERO;
        // Set the size of the canvas
        this.setCanvasSize(canvasSize);
        // Set the size of the viewport
        this.setSize(canvasSize);
        this.setZoomLevel(zoomLevel);
        // Set the center (and make the viewport stay there)
        this.setCenter(this.view.halfSize.clone());
        this.setFocus(this.view.halfSize.clone());
        console.log("initing viewport");
    }
    /** Enables the viewport to zoom in and out */
    enableZoom() {
        this.scrollZoomEnabled = true;
    }
    /**
     * Returns the position of the viewport
     * @returns The center of the viewport as a Vec2
     */
    getCenter() {
        return this.view.center;
    }
    /**
     * Returns a new Vec2 with the origin of the viewport
     * @returns The top left cornder of the Vieport as a Vec2
     */
    getOrigin() {
        return new Vec2_1.default(this.view.left, this.view.top);
    }
    /**
     * Returns the region visible to this viewport
     * @returns The AABB containing the region visible to the viewport
     */
    getView() {
        return this.view;
    }
    /**
     * Set the position of the viewport
     * @param vecOrX The new position or the x-coordinate of the new position
     * @param y The y-coordinate of the new position
     */
    setCenter(vecOrX, y = null) {
        let pos;
        if (vecOrX instanceof Vec2_1.default) {
            pos = vecOrX;
        }
        else {
            pos = new Vec2_1.default(vecOrX, y);
        }
        this.view.center = pos;
    }
    /**
     * Returns the size of the viewport as a Vec2
     * @returns The half-size of the viewport as a Vec2
     */
    getHalfSize() {
        return this.view.getHalfSize();
    }
    /**
     * Sets the size of the viewport
     * @param vecOrX The new width of the viewport or the new size as a Vec2
     * @param y The new height of the viewport
     */
    setSize(vecOrX, y = null) {
        if (vecOrX instanceof Vec2_1.default) {
            this.view.setHalfSize(vecOrX.scaled(1 / 2));
        }
        else {
            this.view.setHalfSize(new Vec2_1.default(vecOrX / 2, y / 2));
        }
    }
    /**
     * Sets the half-size of the viewport
     * @param vecOrX The new half-width of the viewport or the new half-size as a Vec2
     * @param y The new height of the viewport
     */
    setHalfSize(vecOrX, y = null) {
        if (vecOrX instanceof Vec2_1.default) {
            this.view.setHalfSize(vecOrX.clone());
        }
        else {
            this.view.setHalfSize(new Vec2_1.default(vecOrX, y));
        }
    }
    /**
     * Updates the viewport with the size of the current Canvas
     * @param vecOrX The width of the canvas, or the canvas size as a Vec2
     * @param y The height of the canvas
     */
    setCanvasSize(vecOrX, y = null) {
        if (vecOrX instanceof Vec2_1.default) {
            this.canvasSize = vecOrX.clone();
        }
        else {
            this.canvasSize = new Vec2_1.default(vecOrX, y);
        }
    }
    /**
     * Sets the zoom level of the viewport
     * @param zoom The zoom level
     */
    setZoomLevel(zoom) {
        this.view.halfSize.copy(this.canvasSize.scaled(1 / zoom / 2));
    }
    /**
     * Gets the zoom level of the viewport
     * @returns The zoom level
     */
    getZoomLevel() {
        return this.canvasSize.x / this.view.hw / 2;
    }
    /**
     * Sets the smoothing factor for the viewport movement.
     * @param smoothingFactor The smoothing factor for the viewport
     */
    setSmoothingFactor(smoothingFactor) {
        if (smoothingFactor < 1)
            smoothingFactor = 1;
        this.smoothingFactor = smoothingFactor;
    }
    /**
     * Tells the viewport to focus on a point. Overidden by "following".
     * @param focus The point the  viewport should focus on
     */
    setFocus(focus) {
        this.focus.copy(focus);
    }
    /**
     * Returns true if the CanvasNode is inside of the viewport
     * @param node The node to check
     * @returns True if the node is currently visible in the viewport, false if not
     */
    includes(node) {
        let parallax = node.getLayer() instanceof ParallaxLayer_1.default || node.getLayer() instanceof UILayer_1.default
            ? node.getLayer().parallax
            : new Vec2_1.default(1, 1);
        let center = this.view.center.clone();
        this.view.center.mult(parallax);
        let overlaps = this.view.overlaps(node.boundary);
        this.view.center = center;
        return overlaps;
    }
    // TODO: Put some error handling on this for trying to make the bounds too small for the viewport
    // TODO: This should probably be done automatically, or should consider the aspect ratio or something
    /**
     * Sets the bounds of the viewport
     * @param lowerX The left edge of the viewport
     * @param lowerY The top edge of the viewport
     * @param upperX The right edge of the viewport
     * @param upperY The bottom edge of the viewport
     */
    setBounds(lowerX, lowerY, upperX, upperY) {
        let hwidth = (upperX - lowerX) / 2;
        let hheight = (upperY - lowerY) / 2;
        let x = lowerX + hwidth;
        let y = lowerY + hheight;
        this.boundary.center.set(x, y);
        this.boundary.halfSize.set(hwidth, hheight);
    }
    /**
     * Make the viewport follow the specified GameNode
     * @param node The GameNode to follow
     */
    follow(node) {
        this.following = node;
    }
    updateView() {
        if (this.lastPositions.getSize() > this.smoothingFactor) {
            this.lastPositions.dequeue();
        }
        // Get the average of the last 10 positions
        let pos = Vec2_1.default.ZERO;
        this.lastPositions.forEach((position) => pos.add(position));
        pos.scale(1 / this.lastPositions.getSize());
        // Set this position either to the object or to its bounds
        pos.x = MathUtils_1.default.clamp(pos.x, this.boundary.left + this.view.hw, this.boundary.right - this.view.hw);
        pos.y = MathUtils_1.default.clamp(pos.y, this.boundary.top + this.view.hh, this.boundary.bottom - this.view.hh);
        // Assure there are no lines in the tilemap
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        this.view.center.copy(pos);
    }
    update(deltaT) {
        // If zoom is enabled
        if (this.scrollZoomEnabled) {
            if (Input_1.default.didJustScroll()) {
                let currentSize = this.view.getHalfSize().clone();
                if (Input_1.default.getScrollDirection() < 0) {
                    // Zoom in
                    currentSize.scale(1 / this.ZOOM_FACTOR);
                }
                else {
                    // Zoom out
                    currentSize.scale(this.ZOOM_FACTOR);
                }
                if (currentSize.x > this.boundary.hw) {
                    let factor = this.boundary.hw / currentSize.x;
                    currentSize.x = this.boundary.hw;
                    currentSize.y *= factor;
                }
                if (currentSize.y > this.boundary.hh) {
                    let factor = this.boundary.hh / currentSize.y;
                    currentSize.y = this.boundary.hh;
                    currentSize.x *= factor;
                }
                this.view.setHalfSize(currentSize);
            }
        }
        // If viewport is following an object
        if (this.following) {
            // Update our list of previous positions
            this.lastPositions.enqueue(this.following.position.clone());
        }
        else {
            this.lastPositions.enqueue(this.focus);
        }
        this.updateView();
    }
}
exports.default = Viewport;
},{"../DataTypes/Queue":12,"../DataTypes/Shapes/AABB":14,"../DataTypes/Vec2":21,"../Input/Input":29,"../Scene/Layers/ParallaxLayer":89,"../Scene/Layers/UILayer":90,"../Utils/MathUtils":100}],85:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sprite_1 = __importDefault(require("../../Nodes/Sprites/Sprite"));
const AnimatedSprite_1 = __importDefault(require("../../Nodes/Sprites/AnimatedSprite"));
const GraphicTypes_1 = require("../../Nodes/Graphics/GraphicTypes");
const UIElementTypes_1 = require("../../Nodes/UIElements/UIElementTypes");
const Point_1 = __importDefault(require("../../Nodes/Graphics/Point"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const Button_1 = __importDefault(require("../../Nodes/UIElements/Button"));
const Label_1 = __importDefault(require("../../Nodes/UIElements/Label"));
const Slider_1 = __importDefault(require("../../Nodes/UIElements/Slider"));
const TextInput_1 = __importDefault(require("../../Nodes/UIElements/TextInput"));
const Rect_1 = __importDefault(require("../../Nodes/Graphics/Rect"));
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const Line_1 = __importDefault(require("../../Nodes/Graphics/Line"));
const Particle_1 = __importDefault(require("../../Nodes/Graphics/Particle"));
// @ignorePage
/**
 * A factory that abstracts adding @reference[CanvasNode]s to the @reference[Scene].
 * Access methods in this factory through Scene.add.[methodName]().
 */
class CanvasNodeFactory {
    constructor() {
        /**
         * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
         * @param type The type of UIElement to add
         * @param layerName The layer to add the UIElement to
         * @param options Any additional arguments to feed to the constructor
         * @returns A new UIElement
         */
        this.addUIElement = (type, layerName, options) => {
            // Get the layer
            let layer = this.scene.getLayer(layerName);
            let instance;
            switch (type) {
                case UIElementTypes_1.UIElementType.BUTTON:
                    instance = this.buildButton(options);
                    break;
                case UIElementTypes_1.UIElementType.LABEL:
                    instance = this.buildLabel(options);
                    break;
                case UIElementTypes_1.UIElementType.SLIDER:
                    instance = this.buildSlider(options);
                    break;
                case UIElementTypes_1.UIElementType.TEXT_INPUT:
                    instance = this.buildTextInput(options);
                    break;
                default:
                    throw `UIElementType '${type}' does not exist, or is registered incorrectly.`;
            }
            instance.setScene(this.scene);
            instance.id = this.scene.generateId();
            this.scene.getSceneGraph().addNode(instance);
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds a sprite to the current scene
         * @param key The key of the image the sprite will represent
         * @param layerName The layer on which to add the sprite
         * @returns A new Sprite
         */
        this.addSprite = (key, layerName) => {
            let layer = this.scene.getLayer(layerName);
            let instance = new Sprite_1.default(key);
            // Add instance to scene
            instance.setScene(this.scene);
            instance.id = this.scene.generateId();
            if (!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))) {
                this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds an AnimatedSprite to the current scene
         * @param key The key of the image the sprite will represent
         * @param layerName The layer on which to add the sprite
         * @returns A new AnimatedSprite
         */
        this.addAnimatedSprite = (key, layerName) => {
            let layer = this.scene.getLayer(layerName);
            let spritesheet = this.resourceManager.getSpritesheet(key);
            let instance = new AnimatedSprite_1.default(spritesheet);
            // Add instance fo scene
            instance.setScene(this.scene);
            instance.id = this.scene.generateId();
            if (!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))) {
                this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
        /**
         * Adds a new graphic element to the current Scene
         * @param type The type of graphic to add
         * @param layerName The layer on which to add the graphic
         * @param options Any additional arguments to send to the graphic constructor
         * @returns A new Graphic
         */
        this.addGraphic = (type, layerName, options) => {
            // Get the layer
            let layer = this.scene.getLayer(layerName);
            let instance;
            switch (type) {
                case GraphicTypes_1.GraphicType.POINT:
                    instance = this.buildPoint(options);
                    break;
                case GraphicTypes_1.GraphicType.LINE:
                    instance = this.buildLine(options);
                    break;
                case GraphicTypes_1.GraphicType.RECT:
                    instance = this.buildRect(options);
                    break;
                case GraphicTypes_1.GraphicType.PARTICLE:
                    instance = this.buildParticle(options);
                    break;
                default:
                    throw `GraphicType '${type}' does not exist, or is registered incorrectly.`;
            }
            // Add instance to scene
            instance.setScene(this.scene);
            instance.id = this.scene.generateId();
            if (!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))) {
                this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
    }
    init(scene) {
        this.scene = scene;
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
    /* ---------- BUILDERS ---------- */
    buildButton(options) {
        this.checkIfPropExists("Button", options, "position", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Button", options, "text", "string");
        return new Button_1.default(options.position, options.text);
    }
    buildLabel(options) {
        this.checkIfPropExists("Label", options, "position", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Label", options, "text", "string");
        let fontSize = 30;
        if (options.fontSize) {
            fontSize = options.fontSize;
        }
        return new Label_1.default(options.position, options.text, fontSize);
    }
    buildSlider(options) {
        this.checkIfPropExists("Slider", options, "position", Vec2_1.default, "Vec2");
        let initValue = 0;
        if (options.value !== undefined) {
            initValue = options.value;
        }
        return new Slider_1.default(options.position, initValue);
    }
    buildTextInput(options) {
        this.checkIfPropExists("TextInput", options, "position", Vec2_1.default, "Vec2");
        return new TextInput_1.default(options.position);
    }
    buildPoint(options) {
        this.checkIfPropExists("Point", options, "position", Vec2_1.default, "Vec2");
        return new Point_1.default(options.position);
    }
    buildParticle(options) {
        this.checkIfPropExists("Particle", options, "position", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Particle", options, "size", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Particle", options, "mass", "number", "number");
        //Changed for testing
        return new Particle_1.default(options.position, options.size, options.mass);
    }
    buildLine(options) {
        this.checkIfPropExists("Line", options, "start", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Line", options, "end", Vec2_1.default, "Vec2");
        return new Line_1.default(options.start, options.end);
    }
    buildRect(options) {
        this.checkIfPropExists("Rect", options, "position", Vec2_1.default, "Vec2");
        this.checkIfPropExists("Rect", options, "size", Vec2_1.default, "Vec2");
        return new Rect_1.default(options.position, options.size);
    }
    /* ---------- ERROR HANDLING ---------- */
    checkIfPropExists(objectName, options, prop, type, typeName) {
        if (!options || options[prop] === undefined) {
            // Check that the options object has the property
            throw `${objectName} object requires argument ${prop} of type ${typeName}, but none was provided.`;
        }
        else {
            // Check that the property has the correct type
            if ((typeof type) === "string") {
                if (!(typeof options[prop] === type)) {
                    throw `${objectName} object requires argument ${prop} of type ${type}, but provided ${prop} was not of type ${type}.`;
                }
            }
            else if (type instanceof Function) {
                // If type is a constructor, check against that
                if (!(options[prop] instanceof type)) {
                    throw `${objectName} object requires argument ${prop} of type ${typeName}, but provided ${prop} was not of type ${typeName}.`;
                }
            }
            else {
                throw `${objectName} object requires argument ${prop} of type ${typeName}, but provided ${prop} was not of type ${typeName}.`;
            }
        }
    }
}
exports.default = CanvasNodeFactory;
},{"../../DataTypes/Vec2":21,"../../Nodes/Graphics/GraphicTypes":39,"../../Nodes/Graphics/Line":40,"../../Nodes/Graphics/Particle":41,"../../Nodes/Graphics/Point":42,"../../Nodes/Graphics/Rect":43,"../../Nodes/Sprites/AnimatedSprite":44,"../../Nodes/Sprites/Sprite":45,"../../Nodes/UIElements/Button":49,"../../Nodes/UIElements/Label":50,"../../Nodes/UIElements/Slider":51,"../../Nodes/UIElements/TextInput":52,"../../Nodes/UIElements/UIElementTypes":53,"../../ResourceManager/ResourceManager":81}],86:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasNodeFactory_1 = __importDefault(require("./CanvasNodeFactory"));
const TilemapFactory_1 = __importDefault(require("./TilemapFactory"));
/**
 * The manager of all factories used for adding @reference[GameNode]s to the @reference[Scene].
 */
class FactoryManager {
    constructor(scene, tilemaps) {
        // Constructors are called here to allow assignment of their functions to functions in this class
        this.canvasNodeFactory = new CanvasNodeFactory_1.default();
        this.tilemapFactory = new TilemapFactory_1.default();
        this.canvasNodeFactory.init(scene);
        this.tilemapFactory.init(scene, tilemaps);
    }
    // Expose all of the factories through the factory manager
    /**
     * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
     * @param type The type of UIElement to add
     * @param layerName The layer to add the UIElement to
     * @param options Any additional arguments to feed to the constructor
     * @returns A new UIElement
     */
    uiElement(type, layerName, options) {
        return this.canvasNodeFactory.addUIElement(type, layerName, options);
    }
    /**
     * Adds a sprite to the current scene
     * @param key The key of the image the sprite will represent
     * @param layerName The layer on which to add the sprite
     * @returns A new Sprite
     */
    sprite(key, layerName) {
        return this.canvasNodeFactory.addSprite(key, layerName);
    }
    /**
     * Adds an AnimatedSprite to the current scene
     * @param key The key of the image the sprite will represent
     * @param layerName The layer on which to add the sprite
     * @returns A new AnimatedSprite
     */
    animatedSprite(key, layerName) {
        return this.canvasNodeFactory.addAnimatedSprite(key, layerName);
    }
    /**
     * Adds a new graphic element to the current Scene
     * @param type The type of graphic to add
     * @param layerName The layer on which to add the graphic
     * @param options Any additional arguments to send to the graphic constructor
     * @returns A new Graphic
     */
    graphic(type, layerName, options) {
        return this.canvasNodeFactory.addGraphic(type, layerName, options);
    }
    /**
     * Adds a tilemap to the scene
     * @param key The key of the loaded tilemap to load
     * @param constr The constructor of the desired tilemap
     * @param args Additional arguments to send to the tilemap constructor
     * @returns An array of Layers, each of which contains a layer of the tilemap as its own Tilemap instance.
     */
    tilemap(key, scale) {
        return this.tilemapFactory.add(key, scale);
    }
}
exports.default = FactoryManager;
},{"./CanvasNodeFactory":85,"./TilemapFactory":87}],87:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../../ResourceManager/ResourceManager"));
const OrthogonalTilemap_1 = __importDefault(require("../../Nodes/Tilemaps/OrthogonalTilemap"));
const Tileset_1 = __importDefault(require("../../DataTypes/Tilesets/Tileset"));
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const PositionGraph_1 = __importDefault(require("../../DataTypes/Graphs/PositionGraph"));
const Navmesh_1 = __importDefault(require("../../Pathfinding/Navmesh"));
// @ignorePage
/**
 * A factory that abstracts adding @reference[Tilemap]s to the @reference[Scene].
 * Access methods in this factory through Scene.add.[methodName]().
 */
class TilemapFactory {
    constructor() {
        // TODO - This is specifically catered to Tiled tilemaps right now. In the future,
        // it would be good to have a "parseTilemap" function that would convert the tilemap
        // data into a standard format. This could allow for support from other programs
        // or the development of an internal level builder tool
        /**
         * Adds a tilemap to the scene
         * @param key The key of the loaded tilemap to load
         * @param constr The constructor of the desired tilemap
         * @param args Additional arguments to send to the tilemap constructor
         * @returns An array of Layers, each of which contains a layer of the tilemap as its own Tilemap instance.
         */
        this.add = (key, scale = new Vec2_1.default(1, 1)) => {
            // Get Tilemap Data
            let tilemapData = this.resourceManager.getTilemap(key);
            // Set the constructor for this tilemap to either be orthographic or isometric
            let constr;
            if (tilemapData.orientation === "orthographic") {
                constr = OrthogonalTilemap_1.default;
            }
            else {
                // No isometric tilemap support right now, so Orthographic tilemap
                constr = OrthogonalTilemap_1.default;
            }
            // Initialize the return value array
            let sceneLayers = new Array();
            // Create all of the tilesets for this tilemap
            let tilesets = new Array();
            let collectionTiles = new Array();
            for (let tileset of tilemapData.tilesets) {
                if (tileset.image) {
                    // If this is a standard tileset and not a collection, create a tileset for it.
                    // TODO - We are ignoring collection tilesets for now. This is likely not a great idea in practice,
                    // as theoretically someone could want to use one for a standard tilemap. We are assuming for now
                    // that we only want to use them for object layers
                    tilesets.push(new Tileset_1.default(tileset));
                }
                else {
                    tileset.tiles.forEach(tile => tile.id += tileset.firstgid);
                    collectionTiles.push(...tileset.tiles);
                }
            }
            // Loop over the layers of the tilemap and create tiledlayers or object layers
            for (let layer of tilemapData.layers) {
                let sceneLayer;
                let isParallaxLayer = false;
                let depth = 0;
                if (layer.properties) {
                    for (let prop of layer.properties) {
                        if (prop.name === "Parallax") {
                            isParallaxLayer = prop.value;
                        }
                        else if (prop.name === "Depth") {
                            depth = prop.value;
                        }
                    }
                }
                if (isParallaxLayer) {
                    sceneLayer = this.scene.addParallaxLayer(layer.name, new Vec2_1.default(1, 1), depth);
                }
                else {
                    sceneLayer = this.scene.addLayer(layer.name, depth);
                }
                if (layer.type === "tilelayer") {
                    // Create a new tilemap object for the layer
                    let tilemap = new constr(tilemapData, layer, tilesets, scale);
                    tilemap.id = this.scene.generateId();
                    tilemap.setScene(this.scene);
                    // Add tilemap to scene
                    this.tilemaps.push(tilemap);
                    sceneLayer.addNode(tilemap);
                    // Register tilemap with physics if it's collidable
                    if (tilemap.isCollidable) {
                        tilemap.addPhysics();
                        if (layer.properties) {
                            for (let item of layer.properties) {
                                if (item.name === "Group") {
                                    tilemap.setGroup(item.value);
                                }
                            }
                        }
                    }
                }
                else {
                    let isNavmeshPoints = false;
                    let navmeshName;
                    let edges;
                    if (layer.properties) {
                        for (let prop of layer.properties) {
                            if (prop.name === "NavmeshPoints") {
                                isNavmeshPoints = true;
                            }
                            else if (prop.name === "name") {
                                navmeshName = prop.value;
                            }
                            else if (prop.name === "edges") {
                                edges = prop.value;
                            }
                        }
                    }
                    if (isNavmeshPoints) {
                        let g = new PositionGraph_1.default();
                        for (let obj of layer.objects) {
                            g.addPositionedNode(new Vec2_1.default(obj.x, obj.y));
                        }
                        for (let edge of edges) {
                            g.addEdge(edge.from, edge.to);
                        }
                        this.scene.getNavigationManager().addNavigableEntity(navmeshName, new Navmesh_1.default(g));
                        continue;
                    }
                    // Layer is an object layer, so add each object as a sprite to a new layer
                    for (let obj of layer.objects) {
                        // Check if obj is collidable
                        let hasPhysics = false;
                        let isCollidable = false;
                        let isTrigger = false;
                        let onEnter = null;
                        let onExit = null;
                        let triggerGroup = null;
                        let group = "";
                        if (obj.properties) {
                            for (let prop of obj.properties) {
                                if (prop.name === "HasPhysics") {
                                    hasPhysics = prop.value;
                                }
                                else if (prop.name === "Collidable") {
                                    isCollidable = prop.value;
                                }
                                else if (prop.name === "Group") {
                                    group = prop.value;
                                }
                                else if (prop.name === "IsTrigger") {
                                    isTrigger = prop.value;
                                }
                                else if (prop.name === "TriggerGroup") {
                                    triggerGroup = prop.value;
                                }
                                else if (prop.name === "TriggerOnEnter") {
                                    onEnter = prop.value;
                                }
                                else if (prop.name === "TriggerOnExit") {
                                    onExit = prop.value;
                                }
                            }
                        }
                        let sprite;
                        // Check if obj is a tile from a tileset
                        for (let tileset of tilesets) {
                            if (tileset.hasTile(obj.gid)) {
                                // The object is a tile from this set
                                let imageKey = tileset.getImageKey();
                                let offset = tileset.getImageOffsetForTile(obj.gid);
                                sprite = this.scene.add.sprite(imageKey, layer.name);
                                let size = tileset.getTileSize().clone();
                                sprite.position.set((obj.x + size.x / 2) * scale.x, (obj.y - size.y / 2) * scale.y);
                                sprite.setImageOffset(offset);
                                sprite.size.copy(size);
                                sprite.scale.set(scale.x, scale.y);
                            }
                        }
                        // Not in a tileset, must correspond to a collection
                        if (!sprite) {
                            for (let tile of collectionTiles) {
                                if (obj.gid === tile.id) {
                                    let imageKey = tile.image;
                                    sprite = this.scene.add.sprite(imageKey, layer.name);
                                    sprite.position.set((obj.x + tile.imagewidth / 2) * scale.x, (obj.y - tile.imageheight / 2) * scale.y);
                                    sprite.scale.set(scale.x, scale.y);
                                }
                            }
                        }
                        // Now we have sprite. Associate it with our physics object if there is one
                        if (hasPhysics) {
                            // Make the sprite a static physics object
                            sprite.addPhysics(sprite.boundary.clone(), Vec2_1.default.ZERO, isCollidable, true);
                            sprite.setGroup(group);
                            if (isTrigger && triggerGroup !== null) {
                                sprite.setTrigger(triggerGroup, onEnter, onExit);
                            }
                        }
                    }
                }
                // Update the return value
                sceneLayers.push(sceneLayer);
            }
            return sceneLayers;
        };
    }
    init(scene, tilemaps) {
        this.scene = scene;
        this.tilemaps = tilemaps;
        this.resourceManager = ResourceManager_1.default.getInstance();
    }
}
exports.default = TilemapFactory;
},{"../../DataTypes/Graphs/PositionGraph":6,"../../DataTypes/Tilesets/Tileset":20,"../../DataTypes/Vec2":21,"../../Nodes/Tilemaps/OrthogonalTilemap":47,"../../Pathfinding/Navmesh":56,"../../ResourceManager/ResourceManager":81}],88:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("../Utils/MathUtils"));
/**
 * A layer in the scene. Layers are used for sorting @reference[GameNode]s by depth.
 */
class Layer {
    /**
     * Creates a new layer. To do this in a game, use the addLayer() method in @refrence[Scene]
     * @param scene The scene to add the layer to
     * @param name The name of the layer
     */
    constructor(scene, name) {
        this.scene = scene;
        this.name = name;
        this.paused = false;
        this.hidden = false;
        this.alpha = 1;
        this.items = new Array();
        this.ySort = false;
        this.depth = 0;
    }
    /**
     * Retreives the name of the layer
     * @returns The name of the layer
     */
    getName() {
        return this.name;
    }
    /**
     * Pauses/Unpauses the layer. Affects all elements in this layer
     * @param pauseValue True if the layer should be paused, false if not
     */
    setPaused(pauseValue) {
        this.paused = pauseValue;
    }
    /**
     * Returns whether or not the layer is paused
     */
    isPaused() {
        return this.paused;
    }
    /**
     * Sets the opacity of the layer
     * @param alpha The new opacity value in the range [0, 1]
     */
    setAlpha(alpha) {
        this.alpha = MathUtils_1.default.clamp(alpha, 0, 1);
    }
    /**
     * Gets the opacity of the layer
     * @returns The opacity
     */
    getAlpha() {
        return this.alpha;
    }
    /**
     * Sets the layer's hidden value. If hidden, a layer will not be rendered, but will still update
     * @param hidden The hidden value of the layer
     */
    setHidden(hidden) {
        this.hidden = hidden;
    }
    /**
     * Returns the hideen value of the lyaer
     * @returns True if the scene is hidden, false otherwise
     */
    isHidden() {
        return this.hidden;
    }
    /** Pauses this scene and hides it */
    disable() {
        this.paused = true;
        this.hidden = true;
    }
    /** Unpauses this layer and makes it visible */
    enable() {
        this.paused = false;
        this.hidden = false;
    }
    /**
     * Sets whether or not the scene will ySort automatically.
     * ySorting means that CanvasNodes on this layer will have their depth sorted depending on their y-value.
     * This means that if an object is "higher" in the scene, it will sort behind objects that are "lower".
     * This is useful for 3/4 view games, or similar situations, where you sometimes want to be in front of objects,
     * and other times want to be behind the same objects.
     * @param ySort True if ySorting should be active, false if not
     */
    setYSort(ySort) {
        this.ySort = ySort;
    }
    /**
     * Gets the ySort status of the scene
     * @returns True if ySorting is occurring, false otherwise
     */
    getYSort() {
        return this.ySort;
    }
    /**
     * Sets the depth of the layer compared to other layers. A larger number means the layer will be closer to the screen.
     * @param depth The depth of the layer.
     */
    setDepth(depth) {
        this.depth = depth;
    }
    /**
     * Retrieves the depth of the layer.
     * @returns The depth
     */
    getDepth() {
        return this.depth;
    }
    /**
     * Adds a node to this layer
     * @param node The node to add to this layer.
     */
    addNode(node) {
        this.items.push(node);
        node.setLayer(this);
    }
    /**
     * Removes a node from this layer
     * @param node The node to remove
     * @returns true if the node was removed, false otherwise
     */
    removeNode(node) {
        // Find and remove the node
        let index = this.items.indexOf(node);
        if (index !== -1) {
            this.items.splice(index, 1);
            node.setLayer(undefined);
        }
    }
    /**
     * Retreives all GameNodes from this layer
     * @returns an Array that contains all of the GameNodes in this layer.
     */
    getItems() {
        return this.items;
    }
}
exports.default = Layer;
},{"../Utils/MathUtils":100}],89:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Layer_1 = __importDefault(require("../Layer"));
/**
 * An extension of a Layer that has a parallax value.
 */
class ParallaxLayer extends Layer_1.default {
    /**
     * Creates a new ParallaxLayer.
     * Use addParallaxLayer() in @reference[Scene] to add a layer of this type to your game.
     * @param scene The Scene to add this ParallaxLayer to
     * @param name The name of the ParallaxLayer
     * @param parallax The parallax level
     */
    constructor(scene, name, parallax) {
        super(scene, name);
        this.parallax = parallax;
    }
}
exports.default = ParallaxLayer;
},{"../Layer":88}],90:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../DataTypes/Vec2"));
const ParallaxLayer_1 = __importDefault(require("./ParallaxLayer"));
/**
 * A Layer strictly to be used for managing UIElements.
 * This is intended to be a Layer that always stays in the same place,
 * and thus renders things like a HUD or an inventory without taking into consideration the \reference[Viewport] scroll.
 */
class UILayer extends ParallaxLayer_1.default {
    /**
     * Creates a new UILayer.
     * Use addUILayer() in @reference[Scene] to add a layer of this type to your game.
     * @param scene The Scene to add this UILayer to
     * @param name The name of the UILayer
     */
    constructor(scene, name) {
        super(scene, name, Vec2_1.default.ZERO);
    }
}
exports.default = UILayer;
},{"../../DataTypes/Vec2":21,"./ParallaxLayer":89}],91:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Layer_1 = __importDefault(require("./Layer"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
const BasicPhysicsManager_1 = __importDefault(require("../Physics/BasicPhysicsManager"));
const SceneGraphArray_1 = __importDefault(require("../SceneGraph/SceneGraphArray"));
const FactoryManager_1 = __importDefault(require("./Factories/FactoryManager"));
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const Emitter_1 = __importDefault(require("../Events/Emitter"));
const NavigationManager_1 = __importDefault(require("../Pathfinding/NavigationManager"));
const AIManager_1 = __importDefault(require("../AI/AIManager"));
const Map_1 = __importDefault(require("../DataTypes/Map"));
const ParallaxLayer_1 = __importDefault(require("./Layers/ParallaxLayer"));
const UILayer_1 = __importDefault(require("./Layers/UILayer"));
const CanvasNode_1 = __importDefault(require("../Nodes/CanvasNode"));
const SceneOptions_1 = __importDefault(require("./SceneOptions"));
const Debug_1 = __importDefault(require("../Debug/Debug"));
const TimerManager_1 = __importDefault(require("../Timing/TimerManager"));
const TweenManager_1 = __importDefault(require("../Rendering/Animations/TweenManager"));
const ParticleSystemManager_1 = __importDefault(require("../Rendering/Animations/ParticleSystemManager"));
/**
 * Scenes are the main container in the game engine.
 * Your main scene is the current level or menu of the game, and will contain all of the GameNodes needed.
 * Scenes provide an easy way to load assets, add assets to the game world, and unload assets,
 * and have lifecycle methods exposed for these functions.
 */
class Scene {
    /**
     * Creates a new Scene. To add a new Scene in your game, use changeToScene() in @reference[SceneManager]
     * @param viewport The viewport of the game
     * @param sceneManager The SceneManager that owns this Scene
     * @param renderingManager The RenderingManager that will handle this Scene's rendering
     * @param game The instance of the Game
     * @param options The options for Scene initialization
     */
    constructor(viewport, sceneManager, renderingManager, options) {
        this.sceneOptions = SceneOptions_1.default.parse(options === undefined ? {} : options);
        this.worldSize = new Vec2_1.default(500, 500);
        this.viewport = viewport;
        this.viewport.setBounds(0, 0, 2560, 1280);
        this.running = false;
        this.sceneManager = sceneManager;
        this.receiver = new Receiver_1.default();
        this.emitter = new Emitter_1.default();
        this.tilemaps = new Array();
        this.sceneGraph = new SceneGraphArray_1.default(this.viewport, this);
        this.layers = new Map_1.default();
        this.uiLayers = new Map_1.default();
        this.parallaxLayers = new Map_1.default();
        this.physicsManager = new BasicPhysicsManager_1.default(this.sceneOptions.physics);
        this.navManager = new NavigationManager_1.default();
        this.aiManager = new AIManager_1.default();
        this.renderingManager = renderingManager;
        this.add = new FactoryManager_1.default(this, this.tilemaps);
        this.load = ResourceManager_1.default.getInstance();
        this.resourceManager = this.load;
        // Get the timer manager and clear any existing timers
        TimerManager_1.default.getInstance().clearTimers();
    }
    /** A lifecycle method that gets called immediately after a new scene is created, before anything else. */
    initScene(init) { }
    /** A lifecycle method that gets called when a new scene is created. Load all files you wish to access in the scene here. */
    loadScene() { }
    /** A lifecycle method called strictly after loadScene(). Create any game objects you wish to use in the scene here. */
    startScene() { }
    /**
     * A lifecycle method called every frame of the game. This is where you can dynamically do things like add in new enemies
     * @param delta The time this frame represents
     */
    updateScene(deltaT) { }
    /** A lifecycle method that gets called on scene destruction. Specify which files you no longer need for garbage collection. */
    unloadScene() { }
    update(deltaT) {
        this.updateScene(deltaT);
        // Do time updates
        TimerManager_1.default.getInstance().update(deltaT);
        // Do all AI updates
        this.aiManager.update(deltaT);
        // Update all physics objects
        this.physicsManager.update(deltaT);
        // Update all canvas objects
        this.sceneGraph.update(deltaT);
        // Update all tilemaps
        this.tilemaps.forEach(tilemap => {
            if (!tilemap.getLayer().isPaused()) {
                tilemap.update(deltaT);
            }
        });
        // Update all tweens
        TweenManager_1.default.getInstance().update(deltaT);
        // Update all particle systems
        ParticleSystemManager_1.default.getInstance().update(deltaT);
        // Update viewport
        this.viewport.update(deltaT);
    }
    /**
     * Collects renderable sets and coordinates with the RenderingManager to draw the Scene
     */
    render() {
        // Get the visible set of nodes
        let visibleSet = this.sceneGraph.getVisibleSet();
        // Add parallax layer items to the visible set (we're rendering them all for now)
        this.parallaxLayers.forEach(key => {
            let pLayer = this.parallaxLayers.get(key);
            for (let node of pLayer.getItems()) {
                if (node instanceof CanvasNode_1.default) {
                    visibleSet.push(node);
                }
            }
        });
        // Send the visible set, tilemaps, and uiLayers to the renderer
        this.renderingManager.render(visibleSet, this.tilemaps, this.uiLayers);
        let nodes = this.sceneGraph.getAllNodes();
        this.tilemaps.forEach(tilemap => tilemap.visible ? nodes.push(tilemap) : 0);
        Debug_1.default.setNodes(nodes);
    }
    /**
     * Sets the scene as running or not
     * @param running True if the Scene should be running, false if not
     */
    setRunning(running) {
        this.running = running;
    }
    /**
     * Returns whether or not the Scene is running
     * @returns True if the scene is running, false otherwise
     */
    isRunning() {
        return this.running;
    }
    /**
     * Removes a node from this Scene
     * @param node The node to remove
     */
    remove(node) {
        // Remove from the scene graph
        if (node instanceof CanvasNode_1.default) {
            this.sceneGraph.removeNode(node);
        }
    }
    /** Destroys this scene and all nodes in it */
    destroy() {
        for (let node of this.sceneGraph.getAllNodes()) {
            node.destroy();
        }
        for (let tilemap of this.tilemaps) {
            tilemap.destroy();
        }
        this.receiver.destroy();
        delete this.sceneGraph;
        delete this.physicsManager;
        delete this.navManager;
        delete this.aiManager;
        delete this.receiver;
    }
    /**
     * Adds a new layer to the scene and returns it
     * @param name The name of the new layer
     * @param depth The depth of the layer
     * @returns The newly created Layer
     */
    addLayer(name, depth) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw `Layer with name ${name} already exists`;
        }
        let layer = new Layer_1.default(this, name);
        this.layers.add(name, layer);
        if (depth) {
            layer.setDepth(depth);
        }
        return layer;
    }
    /**
     * Adds a new parallax layer to this scene and returns it
     * @param name The name of the parallax layer
     * @param parallax The parallax level
     * @param depth The depth of the layer
     * @returns The newly created ParallaxLayer
     */
    addParallaxLayer(name, parallax, depth) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw `Layer with name ${name} already exists`;
        }
        let layer = new ParallaxLayer_1.default(this, name, parallax);
        this.parallaxLayers.add(name, layer);
        if (depth) {
            layer.setDepth(depth);
        }
        return layer;
    }
    /**
     * Adds a new UILayer to the scene
     * @param name The name of the new UIlayer
     * @returns The newly created UILayer
     */
    addUILayer(name) {
        if (this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)) {
            throw `Layer with name ${name} already exists`;
        }
        let layer = new UILayer_1.default(this, name);
        this.uiLayers.add(name, layer);
        return layer;
    }
    /**
     * Gets a layer from the scene by name if it exists.
     * This can be a Layer or any of its subclasses
     * @param name The name of the layer
     * @returns The Layer found with that name
     */
    getLayer(name) {
        if (this.layers.has(name)) {
            return this.layers.get(name);
        }
        else if (this.parallaxLayers.has(name)) {
            return this.parallaxLayers.get(name);
        }
        else if (this.uiLayers.has(name)) {
            return this.uiLayers.get(name);
        }
        else {
            throw `Requested layer ${name} does not exist.`;
        }
    }
    /**
     * Returns true if this layer is a ParallaxLayer
     * @param name The name of the layer
     * @returns True if this layer is a ParallaxLayer
     */
    isParallaxLayer(name) {
        return this.parallaxLayers.has(name);
    }
    /**
     * Returns true if this layer is a UILayer
     * @param name The name of the layer
     * @returns True if this layer is ParallaxLayer
     */
    isUILayer(name) {
        return this.uiLayers.has(name);
    }
    /**
     * Returns the translation of this node with respect to camera space (due to the viewport moving).
     * This value is affected by the parallax level of the @reference[Layer] the node is on.
     * @param node The node to check the viewport with respect to
     * @returns A Vec2 containing the translation of viewport with respect to this node.
     */
    getViewTranslation(node) {
        let layer = node.getLayer();
        if (layer instanceof ParallaxLayer_1.default || layer instanceof UILayer_1.default) {
            return this.viewport.getOrigin().mult(layer.parallax);
        }
        else {
            return this.viewport.getOrigin();
        }
    }
    /**
     * Returns the scale level of the view
     * @returns The zoom level of the viewport
    */
    getViewScale() {
        return this.viewport.getZoomLevel();
    }
    /**
     * Returns the Viewport associated with this scene
     * @returns The current Viewport
     */
    getViewport() {
        return this.viewport;
    }
    /**
     * Gets the world size of this Scene
     * @returns The world size in a Vec2
     */
    getWorldSize() {
        return this.worldSize;
    }
    /**
     * Gets the SceneGraph associated with this Scene
     * @returns The SceneGraph
     */
    getSceneGraph() {
        return this.sceneGraph;
    }
    /**
     * Gets the PhysicsManager associated with this Scene
     * @returns The PhysicsManager
     */
    getPhysicsManager() {
        return this.physicsManager;
    }
    /**
     * Gets the NavigationManager associated with this Scene
     * @returns The NavigationManager
     */
    getNavigationManager() {
        return this.navManager;
    }
    /**
     * Gets the AIManager associated with this Scene
     * @returns The AIManager
     */
    getAIManager() {
        return this.aiManager;
    }
    /**
     * Generates an ID for a GameNode
     * @returns The new ID
     */
    generateId() {
        return this.sceneManager.generateId();
    }
    /**
     * Retrieves a Tilemap in this Scene
     * @param name The name of the Tilemap
     * @returns The Tilemap, if one this name exists, otherwise null
     */
    getTilemap(name) {
        for (let tilemap of this.tilemaps) {
            if (tilemap.name === name) {
                return tilemap;
            }
        }
        return null;
    }
}
exports.default = Scene;
},{"../AI/AIManager":1,"../DataTypes/Map":8,"../DataTypes/Vec2":21,"../Debug/Debug":22,"../Events/Emitter":24,"../Events/Receiver":28,"../Nodes/CanvasNode":36,"../Pathfinding/NavigationManager":54,"../Physics/BasicPhysicsManager":57,"../Rendering/Animations/ParticleSystemManager":66,"../Rendering/Animations/TweenManager":68,"../ResourceManager/ResourceManager":81,"../SceneGraph/SceneGraphArray":83,"../Timing/TimerManager":96,"./Factories/FactoryManager":86,"./Layer":88,"./Layers/ParallaxLayer":89,"./Layers/UILayer":90,"./SceneOptions":93}],92:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
/**
 * The SceneManager acts as an interface to create Scenes, and handles the lifecycle methods of Scenes.
 * It gives Scenes access to information they need from the @reference[Game] class while keeping a layer of separation.
 */
class SceneManager {
    /**
     * Creates a new SceneManager
     * @param viewport The Viewport of the game
     * @param game The Game instance
     * @param renderingManager The RenderingManager of the game
     */
    constructor(viewport, renderingManager) {
        this.resourceManager = ResourceManager_1.default.getInstance();
        this.viewport = viewport;
        this.renderingManager = renderingManager;
        this.idCounter = 0;
        this.pendingScene = null;
    }
    /**
     * Add a scene as the main scene.
     * Use this method if you've created a subclass of Scene, and you want to add it as the main Scene.
     * @param constr The constructor of the scene to add
     * @param init An object to pass to the init function of the new scene
     */
    changeToScene(constr, init, options) {
        console.log("Creating the new scene - change is pending until next update");
        this.pendingScene = new constr(this.viewport, this, this.renderingManager, options);
        this.pendingSceneInit = init;
    }
    doSceneChange() {
        console.log("Performing scene change");
        this.viewport.setCenter(this.viewport.getHalfSize().x, this.viewport.getHalfSize().y);
        if (this.currentScene) {
            console.log("Unloading old scene");
            this.currentScene.unloadScene();
            console.log("Destroying old scene");
            this.currentScene.destroy();
        }
        console.log("Unloading old resources...");
        this.resourceManager.unloadAllResources();
        // Make the pending scene the current one
        this.currentScene = this.pendingScene;
        // Make the pending scene null
        this.pendingScene = null;
        // Init the scene
        this.currentScene.initScene(this.pendingSceneInit);
        // Enqueue all scene asset loads
        this.currentScene.loadScene();
        // Load all assets
        console.log("Starting Scene Load");
        this.resourceManager.loadResourcesFromQueue(() => {
            console.log("Starting Scene");
            this.currentScene.startScene();
            this.currentScene.setRunning(true);
        });
        this.renderingManager.setScene(this.currentScene);
    }
    /**
     * Generates a unique ID
     * @returns A new ID
     */
    generateId() {
        return this.idCounter++;
    }
    /**
     * Renders the current Scene
     */
    render() {
        if (this.currentScene) {
            this.currentScene.render();
        }
    }
    /**
     * Updates the current Scene
     * @param deltaT The timestep of the Scene
     */
    update(deltaT) {
        if (this.pendingScene !== null) {
            this.doSceneChange();
        }
        if (this.currentScene && this.currentScene.isRunning()) {
            this.currentScene.update(deltaT);
        }
    }
}
exports.default = SceneManager;
},{"../ResourceManager/ResourceManager":81}],93:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ignorePage
/**
 * The options to give a @reference[Scene] for initialization
 */
class SceneOptions {
    static parse(options) {
        let sOpt = new SceneOptions();
        if (options.physics === undefined) {
            sOpt.physics = { groups: undefined, collisions: undefined };
        }
        else {
            sOpt.physics = options.physics;
        }
        return sOpt;
    }
}
exports.default = SceneOptions;
},{}],94:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_AUDIO_CHANNELS = exports.AudioChannelType = void 0;
const Map_1 = __importDefault(require("../DataTypes/Map"));
const Receiver_1 = __importDefault(require("../Events/Receiver"));
const ResourceManager_1 = __importDefault(require("../ResourceManager/ResourceManager"));
const GameEventType_1 = require("../Events/GameEventType");
/**
 * Manages any sounds or music needed for the game.
 * Through the EventQueue, exposes interface to play sounds so GameNodes can activate sounds without
 * needing direct references to the audio system
 */
class AudioManager {
    constructor() {
        this.initAudio();
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe([
            GameEventType_1.GameEventType.PLAY_SOUND,
            GameEventType_1.GameEventType.STOP_SOUND,
            GameEventType_1.GameEventType.PLAY_MUSIC,
            GameEventType_1.GameEventType.PLAY_SFX,
            GameEventType_1.GameEventType.MUTE_CHANNEL,
            GameEventType_1.GameEventType.UNMUTE_CHANNEL
        ]);
        this.currentSounds = new Map_1.default();
        this.gainNodes = new Array(exports.MAX_AUDIO_CHANNELS);
        this.initGainNodes();
    }
    /**
     * Get the instance of the AudioManager class or create a new one if none exists
     * @returns The AudioManager
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }
    /**
     * Initializes the webAudio context
     */
    initAudio() {
        try {
            window.AudioContext = window.AudioContext; // || window.webkitAudioContext; 
            this.audioCtx = new AudioContext();
            console.log('Web Audio API successfully loaded');
        }
        catch (e) {
            console.warn('Web Audio API is not supported in this browser');
        }
    }
    initGainNodes() {
        for (let i = 0; i < exports.MAX_AUDIO_CHANNELS; i++) {
            this.gainNodes[i] = this.audioCtx.createGain();
        }
    }
    /**
     * Returns the current audio context
     * @returns The AudioContext
     */
    getAudioContext() {
        return this.audioCtx;
    }
    /*
        According to the MDN, create a new sound for every call:

        An AudioBufferSourceNode can only be played once; after each call to start(), you have to create a new node
        if you want to play the same sound again. Fortunately, these nodes are very inexpensive to create, and the
        actual AudioBuffers can be reused for multiple plays of the sound. Indeed, you can use these nodes in a
        "fire and forget" manner: create the node, call start() to begin playing the sound, and don't even bother to
        hold a reference to it. It will automatically be garbage-collected at an appropriate time, which won't be
        until sometime after the sound has finished playing.
    */
    /**
     * Creates a new sound from the key of a loaded audio file
     * @param key The key of the loaded audio file to create a new sound for
     * @returns The newly created AudioBuffer
     */
    createSound(key, holdReference, channel, options) {
        // Get audio buffer
        let buffer = ResourceManager_1.default.getInstance().getAudio(key);
        // Create a sound source
        var source = this.audioCtx.createBufferSource();
        // Tell the source which sound to play
        source.buffer = buffer;
        // Add any additional nodes
        const nodes = [source];
        // Do any additional nodes here?
        // Of course, there aren't any supported yet...
        // Add the gain node for this channel
        nodes.push(this.gainNodes[channel]);
        // Connect any nodes along the path
        for (let i = 1; i < nodes.length; i++) {
            nodes[i - 1].connect(nodes[i]);
        }
        // Connect the source to the context's destination
        nodes[nodes.length - 1].connect(this.audioCtx.destination);
        return source;
    }
    /**
     * Play the sound specified by the key
     * @param key The key of the sound to play
     * @param loop A boolean for whether or not to loop the sound
     * @param holdReference A boolean for whether or not we want to hold on to a reference of the audio node. This is good for playing music on a loop that will eventually need to be stopped.
     */
    playSound(key, loop, holdReference, channel, options) {
        let sound = this.createSound(key, holdReference, channel, options);
        if (loop) {
            sound.loop = true;
        }
        // Add a reference of the new sound to a map. This will allow us to stop a looping or long sound at a later time
        if (holdReference) {
            this.currentSounds.add(key, sound);
        }
        sound.start();
    }
    /**
     * Stop the sound specified by the key
     */
    stopSound(key) {
        let sound = this.currentSounds.get(key);
        if (sound) {
            sound.stop();
            this.currentSounds.delete(key);
        }
    }
    muteChannel(channel) {
        this.gainNodes[channel].gain.setValueAtTime(0, this.audioCtx.currentTime);
    }
    unmuteChannel(channel) {
        this.gainNodes[channel].gain.setValueAtTime(1, this.audioCtx.currentTime);
    }
    /**
     * Sets the volume of a channel using the GainNode for that channel. For more
     * information on GainNodes, see https://developer.mozilla.org/en-US/docs/Web/API/GainNode
     * @param channel The audio channel to set the volume for
     * @param volume The volume of the channel. 0 is muted. Values below zero will be set to zero.
     */
    static setVolume(channel, volume) {
        if (volume < 0) {
            volume = 0;
        }
        const am = AudioManager.getInstance();
        am.gainNodes[channel].gain.setValueAtTime(volume, am.audioCtx.currentTime);
    }
    /**
     * Returns the GainNode for this channel.
     * Learn more about GainNodes here https://developer.mozilla.org/en-US/docs/Web/API/GainNode
     * DON'T USE THIS UNLESS YOU KNOW WHAT YOU'RE DOING
     * @param channel The channel
     * @returns The GainNode for the specified channel
     */
    getChannelGainNode(channel) {
        return this.gainNodes[channel];
    }
    update(deltaT) {
        // Play each audio clip requested
        // TODO - Add logic to merge sounds if there are multiple of the same key
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            if (event.type === GameEventType_1.GameEventType.PLAY_SOUND || event.type === GameEventType_1.GameEventType.PLAY_MUSIC || event.type === GameEventType_1.GameEventType.PLAY_SFX) {
                let soundKey = event.data.get("key");
                let loop = event.data.get("loop");
                let holdReference = event.data.get("holdReference");
                let channel = AudioChannelType.DEFAULT;
                if (event.type === GameEventType_1.GameEventType.PLAY_MUSIC) {
                    channel = AudioChannelType.MUSIC;
                }
                else if (GameEventType_1.GameEventType.PLAY_SFX) {
                    channel = AudioChannelType.SFX;
                }
                else if (event.data.has("channel")) {
                    channel = event.data.get("channel");
                }
                this.playSound(soundKey, loop, holdReference, channel, event.data);
            }
            if (event.type === GameEventType_1.GameEventType.STOP_SOUND) {
                let soundKey = event.data.get("key");
                this.stopSound(soundKey);
            }
            if (event.type === GameEventType_1.GameEventType.MUTE_CHANNEL) {
                this.muteChannel(event.data.get("channel"));
            }
            if (event.type === GameEventType_1.GameEventType.UNMUTE_CHANNEL) {
                this.unmuteChannel(event.data.get("channel"));
            }
        }
    }
}
exports.default = AudioManager;
var AudioChannelType;
(function (AudioChannelType) {
    AudioChannelType[AudioChannelType["DEFAULT"] = 0] = "DEFAULT";
    AudioChannelType[AudioChannelType["SFX"] = 1] = "SFX";
    AudioChannelType[AudioChannelType["MUSIC"] = 2] = "MUSIC";
    AudioChannelType[AudioChannelType["CUSTOM_1"] = 3] = "CUSTOM_1";
    AudioChannelType[AudioChannelType["CUSTOM_2"] = 4] = "CUSTOM_2";
    AudioChannelType[AudioChannelType["CUSTOM_3"] = 5] = "CUSTOM_3";
    AudioChannelType[AudioChannelType["CUSTOM_4"] = 6] = "CUSTOM_4";
    AudioChannelType[AudioChannelType["CUSTOM_5"] = 7] = "CUSTOM_5";
    AudioChannelType[AudioChannelType["CUSTOM_6"] = 8] = "CUSTOM_6";
    AudioChannelType[AudioChannelType["CUSTOM_7"] = 9] = "CUSTOM_7";
    AudioChannelType[AudioChannelType["CUSTOM_8"] = 10] = "CUSTOM_8";
    AudioChannelType[AudioChannelType["CUSTOM_9"] = 11] = "CUSTOM_9";
})(AudioChannelType = exports.AudioChannelType || (exports.AudioChannelType = {}));
exports.MAX_AUDIO_CHANNELS = 12;
},{"../DataTypes/Map":8,"../Events/GameEventType":27,"../Events/Receiver":28,"../ResourceManager/ResourceManager":81}],95:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerState = void 0;
const MathUtils_1 = __importDefault(require("../Utils/MathUtils"));
const TimerManager_1 = __importDefault(require("./TimerManager"));
/** */
class Timer {
    constructor(time, onEnd, loop = false) {
        // Register this timer
        TimerManager_1.default.getInstance().addTimer(this);
        this.totalTime = time;
        this.timeLeft = 0;
        this.onEnd = onEnd;
        this.loop = loop;
        this.state = TimerState.STOPPED;
        this.numRuns = 0;
    }
    isStopped() {
        return this.state === TimerState.STOPPED;
    }
    isPaused() {
        return this.state === TimerState.PAUSED;
    }
    /**
     * Returns whether or not this timer has been run before
     * @returns true if it has been run at least once (after the latest reset), and false otherwise
     */
    hasRun() {
        return this.numRuns > 0;
    }
    start(time) {
        if (time !== undefined) {
            this.totalTime = time;
        }
        this.state = TimerState.ACTIVE;
        this.timeLeft = this.totalTime;
    }
    /** Resets this timer. Sets the progress back to zero, and sets the number of runs back to zero */
    reset() {
        this.timeLeft = this.totalTime;
        this.numRuns = 0;
    }
    pause() {
        this.state = TimerState.PAUSED;
    }
    update(deltaT) {
        if (this.state === TimerState.ACTIVE) {
            this.timeLeft -= deltaT * 1000;
            if (this.timeLeft <= 0) {
                this.timeLeft = MathUtils_1.default.clampLow0(this.timeLeft);
                this.end();
            }
        }
    }
    end() {
        // Update the state
        this.state = TimerState.STOPPED;
        this.numRuns += 1;
        // Call the end function if there is one
        if (this.onEnd) {
            this.onEnd();
        }
        // Loop if we want to
        if (this.loop) {
            this.state = TimerState.ACTIVE;
            this.timeLeft = this.totalTime;
        }
    }
    toString() {
        return "Timer: " + this.state + " - Time Left: " + this.timeLeft + "ms of " + this.totalTime + "ms";
    }
}
exports.default = Timer;
var TimerState;
(function (TimerState) {
    TimerState["ACTIVE"] = "ACTIVE";
    TimerState["PAUSED"] = "PAUSED";
    TimerState["STOPPED"] = "STOPPED";
})(TimerState = exports.TimerState || (exports.TimerState = {}));
},{"../Utils/MathUtils":100,"./TimerManager":96}],96:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimerManager {
    constructor() {
        this.timers = new Array();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TimerManager();
        }
        return this.instance;
    }
    addTimer(timer) {
        this.timers.push(timer);
    }
    clearTimers() {
        this.timers = new Array();
    }
    update(deltaT) {
        this.timers.forEach(timer => timer.update(deltaT));
    }
}
exports.default = TimerManager;
},{}],97:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("./MathUtils"));
// TODO: This should be moved to the datatypes folder
/**
 * A Color util class that keeps track of colors like a vector, but can be converted into a string format
 */
class Color {
    /**
     * Creates a new color
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpha
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
     * Transparent color
     * @returns rgba(0, 0, 0, 0)
     */
    static get TRANSPARENT() {
        return new Color(0, 0, 0, 0);
    }
    /**
     * Red color
     * @returns rgb(255, 0, 0)
     */
    static get RED() {
        return new Color(255, 0, 0, 1);
    }
    /**
     * Green color
     * @returns rgb(0, 255, 0)
     */
    static get GREEN() {
        return new Color(0, 255, 0, 1);
    }
    /**
     * Blue color
     * @returns rgb(0, 0, 255)
     */
    static get BLUE() {
        return new Color(0, 0, 255, 1);
    }
    /**
     * Yellow color
     * @returns rgb(255, 255, 0)
     */
    static get YELLOW() {
        return new Color(255, 255, 0, 1);
    }
    /**
     * Magenta color
     * @returns rgb(255, 0, 255)
     */
    static get MAGENTA() {
        return new Color(255, 0, 255, 1);
    }
    /**
     * Cyan color
     * @returns rgb(0, 255, 255)
     */
    static get CYAN() {
        return new Color(0, 255, 255, 1);
    }
    /**
     * White color
     * @returns rgb(255, 255, 255)
     */
    static get WHITE() {
        return new Color(255, 255, 255, 1);
    }
    /**
     * Black color
     * @returns rgb(0, 0, 0)
     */
    static get BLACK() {
        return new Color(0, 0, 0, 1);
    }
    /**
     * Orange color
     * @returns rgb(255, 100, 0)
     */
    static get ORANGE() {
        return new Color(255, 100, 0, 1);
    }
    /**
     * Sets the color to the values provided
     * @param r Red
     * @param g Green
     * @param b Blue
     * @param a Alpha
     */
    set(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    /**
     * Returns a new color slightly lighter than the current color
     * @returns A new lighter Color
     */
    lighten() {
        return new Color(MathUtils_1.default.clamp(this.r + 40, 0, 255), MathUtils_1.default.clamp(this.g + 40, 0, 255), MathUtils_1.default.clamp(this.b + 40, 0, 255), MathUtils_1.default.clamp(this.a + 10, 0, 255));
    }
    /**
     * Returns a new color slightly darker than the current color
     * @returns A new darker Color
     */
    darken() {
        return new Color(MathUtils_1.default.clamp(this.r - 40, 0, 255), MathUtils_1.default.clamp(this.g - 40, 0, 255), MathUtils_1.default.clamp(this.b - 40, 0, 255), MathUtils_1.default.clamp(this.a + 10, 0, 255));
    }
    /**
     * Returns this color as an array
     * @returns [r, g, b, a]
     */
    toArray() {
        return [this.r, this.g, this.b, this.a];
    }
    /**
     * Returns the color as a string of the form #RRGGBB
     * @returns #RRGGBB
     */
    toString() {
        return "#" + MathUtils_1.default.toHex(this.r, 2) + MathUtils_1.default.toHex(this.g, 2) + MathUtils_1.default.toHex(this.b, 2);
    }
    /**
     * Returns the color as a string of the form rgb(r, g, b)
     * @returns rgb(r, g, b)
     */
    toStringRGB() {
        return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
    }
    /**
     * Returns the color as a string of the form rgba(r, g, b, a)
     * @returns rgba(r, g, b, a)
     */
    toStringRGBA() {
        if (this.a === 0) {
            return this.toStringRGB();
        }
        return "rgba(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() + ")";
    }
    /**
     * Turns this color into a float32Array and changes color range to [0.0, 1.0]
     * @returns a Float32Array containing the color
     */
    toWebGL() {
        return new Float32Array([
            this.r / 255,
            this.g / 255,
            this.b / 255,
            this.a
        ]);
    }
    static fromStringHex(str) {
        let i = 0;
        if (str.charAt(0) == "#")
            i += 1;
        let r = MathUtils_1.default.fromHex(str.substring(i, i + 2));
        let g = MathUtils_1.default.fromHex(str.substring(i + 2, i + 4));
        let b = MathUtils_1.default.fromHex(str.substring(i + 4, i + 6));
        return new Color(r, g, b);
    }
}
exports.default = Color;
},{"./MathUtils":100}],98:[function(require,module,exports){
"use strict";
// @ignorePage
Object.defineProperty(exports, "__esModule", { value: true });
exports.EaseFunctionType = void 0;
class EaseFunctions {
    static easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    static easeOutInSine(x) {
        return x < 0.5 ? -Math.cos(Math.PI * (x + 0.5)) / 2 : -Math.cos(Math.PI * (x - 0.5)) / 2 + 1;
    }
    static easeOutSine(x) {
        return Math.sin((x * Math.PI) / 2);
    }
    static easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
    static easeInOutQuint(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    static easeInOutQuad(x) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    static easeOutInQuad(x) {
        return x < 0.5 ? this.easeOutIn_OutPow(x, 2) : this.easeOutIn_InPow(x, 2);
    }
    static easeOutIn_OutPow(x, pow) {
        return 0.5 - Math.pow(-2 * x + 1, pow) / 2;
    }
    static easeOutIn_InPow(x, pow) {
        return 0.5 + Math.pow(2 * x - 1, pow) / 2;
    }
}
exports.default = EaseFunctions;
var EaseFunctionType;
(function (EaseFunctionType) {
    // SINE
    EaseFunctionType["IN_OUT_SINE"] = "easeInOutSine";
    EaseFunctionType["OUT_IN_SINE"] = "easeOutInSine";
    EaseFunctionType["IN_SINE"] = "easeInSine";
    EaseFunctionType["OUT_SINE"] = "easeOutSine";
    // QUAD
    EaseFunctionType["IN_OUT_QUAD"] = "easeInOutQuad";
    EaseFunctionType["OUT_IN_QUAD"] = "easeOutInQuad";
    // QUINT
    EaseFunctionType["IN_OUT_QUINT"] = "easeInOutQuint";
})(EaseFunctionType = exports.EaseFunctionType || (exports.EaseFunctionType = {}));
},{}],99:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** A class to provides some utility functions for graphs */
class GraphUtils {
    /**
     * An implementation of Djikstra's shortest path algorithm based on the one described in The Algorithm Design Manual.
     * @param g The graph
     * @param start The number to start the shortest path from
     * @returns An array containing the parent of each node of the Graph in the shortest path.
     */
    static djikstra(g, start) {
        let i; // Counter
        let p; // Pointer to edgenode
        let inTree = new Array(g.numVertices);
        let distance = new Array(g.numVertices);
        let parent = new Array(g.numVertices);
        let v; // Current vertex to process
        let w; // Candidate for next vertex
        let weight; // Edge weight
        let dist; // Best current distance from start
        for (i = 0; i < g.numVertices; i++) {
            inTree[i] = false;
            distance[i] = Infinity;
            parent[i] = -1;
        }
        distance[start] = 0;
        v = start;
        while (!inTree[v]) {
            inTree[v] = true;
            p = g.edges[v];
            while (p !== null) {
                w = p.y;
                weight = p.weight;
                if (distance[w] > distance[v] + weight) {
                    distance[w] = distance[v] + weight;
                    parent[w] = v;
                }
                p = p.next;
            }
            v = 0;
            dist = Infinity;
            for (i = 0; i <= g.numVertices; i++) {
                if (!inTree[i] && dist > distance[i]) {
                    dist = distance;
                    v = i;
                }
            }
        }
        return parent;
    }
}
exports.default = GraphUtils;
},{}],100:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
/** A class containing some utility functions for math operations */
class MathUtils {
    /**
     * Returns the sign of the value provided
     * @param x The value to extract the sign from
     * @returns -1 if the number is less than 0, 1 otherwise
     */
    static sign(x) {
        return x < 0 ? -1 : 1;
    }
    /**
     * Returns whether or not x is between a and b
     * @param a The min bound
     * @param b The max bound
     * @param x The value to check
     * @param exclusive Whether or not a and b are exclusive bounds
     * @returns True if x is between a and b, false otherwise
     */
    static between(a, b, x, exclusive) {
        if (exclusive) {
            return (a < x) && (x < b);
        }
        else {
            return (a <= x) && (x <= b);
        }
    }
    /**
     * Clamps the value x to the range [min, max], rounding up or down if needed
     * @param x The value to be clamped
     * @param min The min of the range
     * @param max The max of the range
     * @returns x, if it is between min and max, or min/max if it exceeds their bounds
     */
    static clamp(x, min, max) {
        if (x < min)
            return min;
        if (x > max)
            return max;
        return x;
    }
    static vecClamp0(vec, maxX, maxY) {
        let x = MathUtils.clamp(vec.x, 0, maxX);
        let y = MathUtils.clamp(vec.y, 0, maxY);
        return new Vec2_1.default(x, y);
    }
    static vecClamp01(vec) {
        return new Vec2_1.default(MathUtils.clamp(vec.x, 0, 1), MathUtils.clamp(vec.y, 0, 1));
    }
    /**
     * Clamps the value x to the range between 0 and 1
     * @param x The value to be clamped
     * @returns x, if it is between 0 and 1, or 0/1 if it exceeds their bounds
     */
    static clamp01(x) {
        return MathUtils.clamp(x, 0, 1);
    }
    /**
     * Clamps the lower end of the value of x to the range to min
     * @param x The value to be clamped
     * @param min The minimum allowed value of x
     * @returns x, if it is greater than min, otherwise min
     */
    static clampLow(x, min) {
        return x < min ? min : x;
    }
    /**
     * Clamps the higher end of the value of x to the range to max
     * @param x The value to be clamped
     * @param max The maximum allowed value of x
     * @returns x, if it is less than max, otherwise max
     */
    static clampHigh(x, max) {
        return x > max ? max : x;
    }
    /**
     * Clamps the lower end of the value of x to zero
     * @param x The value to be clamped
     * @returns x, if it is greater than 0, otherwise 0
     */
    static clampLow0(x) {
        return MathUtils.clampLow(x, 0);
    }
    static clampMagnitude(v, m) {
        if (v.magSq() > m * m) {
            return v.scaleTo(m);
        }
        else {
            return v;
        }
    }
    static changeRange(x, min, max, newMin, newMax) {
        return this.lerp(newMin, newMax, this.invLerp(min, max, x));
    }
    static vecAbs(vec) {
        return new Vec2_1.default(Math.abs(vec.x), Math.abs(vec.y));
    }
    /**
     * Linear Interpolation
     * @param a The first value for the interpolation bound
     * @param b The second value for the interpolation bound
     * @param t The time we are interpolating to
     * @returns The value between a and b at time t
     */
    static lerp(a, b, t) {
        return a + t * (b - a);
    }
    /**
     * Inverse Linear Interpolation. Finds the time at which a value between a and b would occur
     * @param a The first value for the interpolation bound
     * @param b The second value for the interpolation bound
     * @param value The current value
     * @returns The time at which the current value occurs between a and b
     */
    static invLerp(a, b, value) {
        return (value - a) / (b - a);
    }
    /**
     * Cuts off decimal points of a number after a specified place
     * @param num The number to floor
     * @param place The last decimal place of the new number
     * @returns The floored number
     */
    static floorToPlace(num, place) {
        if (place === 0) {
            return Math.floor(num);
        }
        let factor = 10;
        while (place > 1) {
            factor != 10;
            place--;
        }
        return Math.floor(num * factor) / factor;
    }
    /**
     * Returns a number from a hex string
     * @param str the string containing the hex number
     * @returns the number in decimal represented by the hex string
     */
    static fromHex(str) {
        return parseInt(str, 16);
    }
    /**
     * Returns the number as a hexadecimal
     * @param num The number to convert to hex
     * @param minLength The length of the returned hex string (adds zero padding if needed)
     * @returns The hex representation of the number as a string
     */
    static toHex(num, minLength = null) {
        let factor = 1;
        while (factor * 16 < num) {
            factor *= 16;
        }
        let hexStr = "";
        while (factor >= 1) {
            let digit = Math.floor(num / factor);
            hexStr += MathUtils.toHexDigit(digit);
            num -= digit * factor;
            factor /= 16;
        }
        if (minLength !== null) {
            while (hexStr.length < minLength) {
                hexStr = "0" + hexStr;
            }
        }
        return hexStr;
    }
    /**
     * Converts a digit to hexadecimal. In this case, a digit is between 0 and 15 inclusive
     * @param num The digit to convert to hexadecimal
     * @returns The hex representation of the digit as a string
     */
    static toHexDigit(num) {
        if (num < 10) {
            return "" + num;
        }
        else {
            return String.fromCharCode(65 + num - 10);
        }
    }
}
exports.default = MathUtils;
},{"../DataTypes/Vec2":21}],101:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("./MathUtils"));
const Color_1 = __importDefault(require("./Color"));
const Perlin_1 = __importDefault(require("./Rand/Perlin"));
const Vec2_1 = __importDefault(require("../DataTypes/Vec2"));
class Noise {
    constructor() {
        this.p = new Perlin_1.default();
    }
    perlin(x, y, z) {
        return this.p.perlin(x, y, z);
    }
}
/** A class that has some random generator utils */
class RandUtils {
    /**
     * Generates a random integer in the specified range
     * @param min The min of the range (inclusive)
     * @param max The max of the range (exclusive)
     * @returns A random int in the range [min, max)
     */
    static randInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * Generates a random float in the specified range
     * @param min The min of the range (inclusive)
     * @param max The max of the range (exclusive)
     * @returns A random float in the range [min, max)
     */
    static randFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    /**
     * Generates a random hexadecimal number in the specified range
     * @param min The min of the range (inclusive)
     * @param max The max of the range (exclusive)
     * @returns a random hex number in the range [min, max) as a string
     */
    static randHex(min, max) {
        return MathUtils_1.default.toHex(RandUtils.randInt(min, max));
    }
    /**
     * Generates a random color
     * @returns A random Color
     */
    static randColor() {
        let r = RandUtils.randInt(0, 256);
        let g = RandUtils.randInt(0, 256);
        let b = RandUtils.randInt(0, 256);
        return new Color_1.default(r, g, b);
    }
    static randVec(minX, maxX, minY, maxY) {
        return new Vec2_1.default(this.randFloat(minX, maxX), this.randFloat(minY, maxY));
    }
}
exports.default = RandUtils;
/** A noise generator */
RandUtils.noise = new Noise();
},{"../DataTypes/Vec2":21,"./Color":97,"./MathUtils":100,"./Rand/Perlin":102}],102:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("../MathUtils"));
const permutation = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
/**
 * A noise generator
 */
class Perlin {
    constructor() {
        this.p = new Int16Array(512);
        for (let i = 0; i < 512; i++) {
            this.p[i] = permutation[i % 256];
        }
        this.repeat = -1;
    }
    /**
     * Returns a random perlin noise value
     * @param x An input value
     * @param y An input value
     * @param z An input value
     * @returns A noise value
     */
    perlin(x, y, z = 0) {
        if (this.repeat > 0) {
            x = x % this.repeat;
            y = y % this.repeat;
            z = z % this.repeat;
        }
        // Get the position of the unit cube of (x, y, z)
        let xi = Math.floor(x) & 255;
        let yi = Math.floor(y) & 255;
        let zi = Math.floor(z) & 255;
        // Get the position of (x, y, z) in that unit cube
        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);
        // Use the fade function to relax the coordinates towards a whole value
        let u = this.fade(xf);
        let v = this.fade(yf);
        let w = this.fade(zf);
        // Perlin noise hash function
        let aaa = this.p[this.p[this.p[xi] + yi] + zi];
        let aba = this.p[this.p[this.p[xi] + this.inc(yi)] + zi];
        let aab = this.p[this.p[this.p[xi] + yi] + this.inc(zi)];
        let abb = this.p[this.p[this.p[xi] + this.inc(yi)] + this.inc(zi)];
        let baa = this.p[this.p[this.p[this.inc(xi)] + yi] + zi];
        let bba = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + zi];
        let bab = this.p[this.p[this.p[this.inc(xi)] + yi] + this.inc(zi)];
        let bbb = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + this.inc(zi)];
        // Calculate the value of the perlin noies
        let x1 = MathUtils_1.default.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
        let x2 = MathUtils_1.default.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
        let y1 = MathUtils_1.default.lerp(x1, x2, v);
        x1 = MathUtils_1.default.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
        x2 = MathUtils_1.default.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);
        let y2 = MathUtils_1.default.lerp(x1, x2, v);
        return (MathUtils_1.default.lerp(y1, y2, w) + 1) / 2;
    }
    grad(hash, x, y, z) {
        switch (hash & 0xF) {
            case 0x0: return x + y;
            case 0x1: return -x + y;
            case 0x2: return x - y;
            case 0x3: return -x - y;
            case 0x4: return x + z;
            case 0x5: return -x + z;
            case 0x6: return x - z;
            case 0x7: return -x - z;
            case 0x8: return y + z;
            case 0x9: return -y + z;
            case 0xA: return y - z;
            case 0xB: return -y - z;
            case 0xC: return y + x;
            case 0xD: return -y + z;
            case 0xE: return y - x;
            case 0xF: return -y - z;
            default: return 0; // never happens
        }
    }
    /**
     * Safe increment that doesn't go beyond the repeat value
     * @param num The number to increment
     */
    inc(num) {
        num++;
        if (this.repeat > 0) {
            num %= this.repeat;
        }
        return num;
    }
    /**
     * The fade function 6t^5 - 15t^4 + 10t^3
     * @param t The value we are applying the fade to
     */
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
}
exports.default = Perlin;
},{"../MathUtils":100}],103:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MathUtils_1 = __importDefault(require("./MathUtils"));
class RenderingUtils {
    static toWebGLCoords(point, origin, worldSize) {
        return new Float32Array([
            MathUtils_1.default.changeRange(point.x, origin.x, origin.x + worldSize.x, -1, 1),
            MathUtils_1.default.changeRange(point.y, origin.y, origin.y + worldSize.y, 1, -1)
        ]);
    }
    static toWebGLScale(size, worldSize) {
        return new Float32Array([
            2 * size.x / worldSize.x,
            2 * size.y / worldSize.y,
        ]);
    }
    static toWebGLColor(color) {
        return new Float32Array([
            MathUtils_1.default.changeRange(color.r, 0, 255, 0, 1),
            MathUtils_1.default.changeRange(color.g, 0, 255, 0, 1),
            MathUtils_1.default.changeRange(color.b, 0, 255, 0, 1),
            color.a
        ]);
    }
}
exports.default = RenderingUtils;
},{"./MathUtils":100}],104:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Some utility functions for dealing with strings */
class StringUtils {
    /**
     * Extracts the path from a filepath that includes the file
     * @param filePath the filepath to extract the path from
     * @returns The path portion of the filepath provided
     */
    static getPathFromFilePath(filePath) {
        let splitPath = filePath.split("/");
        splitPath.pop();
        splitPath.push("");
        return splitPath.join("/");
    }
}
exports.default = StringUtils;
},{}],105:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AAControls = void 0;
/**
 * A set of controls for the HW4 keybinding
 */
exports.AAControls = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    JUMP: "JUMP",
    ATTACK: "ATTACK",
    SELECT_TONGUE: "SELECT_TONGUE",
    SELECT_FIREBALL: "SELECT_FIREBALL",
    SELECT_ICE: "SELECT_ICE",
    PAUSE: "PAUSE",
    GOTO_BOSS: "GOTO_BOSS",
    TOGGLE_INVINCIBILITY: "TOGGLE_INVINCIBILITY",
    PLAYER_KILL: "PLAYER_KILL",
    UNLOCK_SPELLS: "UNLOCK_SPELLS",
    // FOR GOTO LEVEL/BOSS
    GOTO_LEVEL_0: "GOTO_LEVEL_0",
    GOTO_LEVEL_1: "GOTO_LEVEL_1",
    GOTO_LEVEL_2: "GOTO_LEVEL_2",
    GOTO_LEVEL_3: "GOTO_LEVEL_3",
    GOTO_LEVEL_4: "GOTO_LEVEL_4",
    GOTO_LEVEL_5: "GOTO_LEVEL_5",
    GOTO_LEVEL_6: "GOTO_LEVEL_6",
};
},{}],106:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AAEvents = void 0;
/**
 * A set of events for HW4
 */
exports.AAEvents = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",
    PLAYER_CREATED: "PLAYER_CREATED",
    // An event triggered when the player enters an area designated as a "level end" location. Had data: {}
    PLAYER_ENTERED_LEVEL_END: "PLAYER_ENTERED_LEVEL_END",
    /**
     * The event that gets emitted when the player's health changes
     *
     * Has data: { curhp: number, maxhp: number }
     */
    HEALTH_CHANGE: "HEALTH_CHANGE",
    // The event sent when a particle hits a tile in the destructible tilemap layer
    PARTICLE_HIT_DESTRUCTIBLE: "PARTICLE_HIT_DESTRUCTIBLE",
    PLAYER_SWING: "PLAYER_SWING",
    CREATE_PLATFORM: "CREATE_PLATFORM",
    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",
    NPC_KILLED: "NPC_KILLED",
    PLAYER_FIRE_JUMP: "PLAYER_FIRE_JUMP",
    SHOOT_TONGUE: "SHOOT_TONGUE",
    TONGUE_WALL_COLLISION: "TONGUE_WALL_COLLISION",
    ICE_COLLISION: "ICE_COLLISION",
    PLAYER_ATTACK: "PLAYER_ATTACK",
    SELECT_TONGUE: "SELECT_TONGUE",
    SELECT_FIREBALL: "SELECT_FIREBALL",
    SELECT_ICE: "SELECT_ICE",
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    FIREBALL_HIT_ENEMY: "FIREBALL_HIT_ENEMY",
    ICEBALL_HIT_ENEMY: "ICEBALL_HIT_ENEMY",
    TONGUE_HIT_ENEMY: "TONGUE_HIT_ENEMY",
    //this is temp i hope
    ENEMY_ATTACHED: "ENEMY_ATTACHED",
    TOGGLE_INVINCIBILITY: "TOGGLE_INVINCIBILITY",
    ANT_FIRE_HIT: "ANT_FIRE_HIT",
    PLAYER_HIT: "PLAYER_HIT",
    PLAYER_HEAL: "PLAYER_HEAL",
    KILL_PLAYER: "KILL_PLAYER",
    ICE_HIT_BOSS: "ICE_HIT_BOSS",
    TONGUE_HIT_BOSS: "TONGUE_HIT_BOSS",
    SPAWN_BOSS: "SPAWN_BOSS",
    PLAYER_TOUCH_ENEMY: "PLAYER_TOUCH_ENEMY",
    BOSS_KILLED: "BOSS_KILLED",
    GOTO_BOSS: "GOTO_BOSS",
};
},{}],107:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AAPhysicsGroups = void 0;
/**
 * An enum with all of the physics groups for HW4
 */
exports.AAPhysicsGroups = {
    // Physics groups for the player and the player's weapon
    PLAYER: "PLAYER",
    /*
        Physics groups for the different tilemap layers. Physics groups for tilemaps are
        embedded in the tilemap layer data by a property called "Group". This lets you
        set the physics group for a particular tilemap layer.
    */
    GROUND: "GROUND",
    DESTRUCTABLE: "DESTRUCTABLE",
    TONGUE_COLLIDABLE: "TONGUE_COLLIDABLE",
    FIREBALL: "FIREBALL",
    FIRE_PARTICLE: "FIRE_PARTICLE",
    ICE_PARTICLE: "ICE_PARTICLE",
    BOSS_PARTICLE: "BOSS_PARTICLE",
    ENEMY_PARTICLE: "ENEMY_PARTICLE",
    TONGUE: "TONGUE",
    ENEMY: "ENEMY",
    ANT_PARTICLE: "ANT_PARTICLE",
    ICE_PLATFORM: "ICE_PLATFORM",
    TUTORIAL: "TUTORIAL",
};
},{}],108:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class AntParticles extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        this.particleVec = Vec2_1.default.ZERO;
        this.dir = 1;
        // private dir = Vec2.ZERO;
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
        // public update(deltaT: number) {
        //     super.update(deltaT);
        //     if (this.particlePool.length > 0 && this.isSystemRunning()) {
        //         let particle = this.particlePool[0];
        //         if (particle) {
        //             particle.move(particle.vel.scaled(deltaT));
        //         }
        //     }
        // }
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
    }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() {
        return this.systemRunning;
    }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() {
        return this.particlePool;
    }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        //particle.vel = RandUtils.randVec(this.dir * 100, this.dir * 150, -30, 50);
        particle.vel = new Vec2_1.default(0, 300);
        particle.color = Color_1.default.RED;
        // particle.vel = RandUtils.randVec(this.dir.x, this.dir.x - 50, this.dir.y, this.dir.y - 80);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        // // const colors = [Color.RED, Color.YELLOW, Color.ORANGE]
        // const colors = [
        //     new Color(60, 227, 18, 1),
        //     new Color(58, 166, 31, 1),
        //     new Color(98, 232, 65, 1),
        //     new Color(42, 196, 4, 1),
        // ];
        // particle.color = colors[RandUtils.randInt(0, 4)];
        if (!particle.tweens) {
            return;
        }
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 800,
            duration: this.lifetime - 800,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE,
                },
            ],
        });
    }
    setDir(dir) {
        this.dir = dir;
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ANT_PARTICLE);
        }
    }
}
exports.default = AntParticles;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../AAPhysicsGroups":107}],109:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const RandUtils_1 = __importDefault(require("../../../Wolfie2D/Utils/RandUtils"));
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class MindFlayerParticles extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        this.particleVec = Vec2_1.default.ZERO;
        this.dir = 1;
        // private dir = Vec2.ZERO;
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
    }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() {
        return this.systemRunning;
    }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() {
        return this.particlePool;
    }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        particle.vel = RandUtils_1.default.randVec(this.dir * 100, this.dir * 150, -30, 50);
        // particle.vel = RandUtils.randVec(this.dir.x, this.dir.x - 50, this.dir.y, this.dir.y - 80);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        // const colors = [Color.RED, Color.YELLOW, Color.ORANGE]
        const colors = [
            new Color_1.default(60, 227, 18, 1),
            new Color_1.default(58, 166, 31, 1),
            new Color_1.default(98, 232, 65, 1),
            new Color_1.default(42, 196, 4, 1),
        ];
        particle.color = colors[RandUtils_1.default.randInt(0, 4)];
        if (!particle.tweens) {
            return;
        }
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 800,
            duration: this.lifetime - 800,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE,
                },
            ],
        });
    }
    setDir(dir) {
        this.dir = dir;
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.BOSS_PARTICLE);
        }
    }
}
exports.default = MindFlayerParticles;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../../Wolfie2D/Utils/RandUtils":101,"../../AAPhysicsGroups":107}],110:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
const StateMachineAI_1 = __importDefault(require("../../../Wolfie2D/AI/StateMachineAI"));
const AAEvents_1 = require("../../AAEvents");
const MathUtils_1 = __importDefault(require("../../../Wolfie2D/Utils/MathUtils"));
const BossStates_1 = require("./NPCStates/BossStates");
class NPCBehavior extends StateMachineAI_1.default {
    constructor() {
        super(...arguments);
        this.MAX_SPEED = 200;
        this.MIN_SPEED = 100;
    }
    initializeAI(owner, options) {
        this.owner = owner;
        this.velocity = Vec2_1.default.ZERO;
    }
    activate(options) { }
    update(deltaT) {
        super.update(deltaT);
    }
    /**
     * @param event the game event
     */
    handleEvent(event) {
        switch (event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity = velocity;
    }
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }
    get maxHealth() {
        return this._maxHealth;
    }
    set maxHealth(maxHealth) {
        this._maxHealth = maxHealth;
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(AAEvents_1.AAEvents.HEALTH_CHANGE, {
            curhp: this.health,
            maxhp: this.maxHealth,
        });
    }
    get health() {
        return this._health;
    }
    set health(health) {
        this._health = MathUtils_1.default.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(AAEvents_1.AAEvents.HEALTH_CHANGE, {
            curhp: this.health,
            maxhp: this.maxHealth,
        });
        // If the health hit 0, change the state of the player
        if (this.health === 0) {
            this.changeState(BossStates_1.MFStates.DEAD);
        }
    }
}
exports.default = NPCBehavior;
},{"../../../Wolfie2D/AI/StateMachineAI":2,"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Utils/MathUtils":100,"../../AAEvents":106,"./NPCStates/BossStates":124}],111:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyStates = void 0;
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
const AAEvents_1 = require("../../../AAEvents");
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
exports.EnemyStates = {
    IDLE: "IDLE",
};
class AntBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.owner = owner;
        this.gravity = 0;
        this.player = options.player;
        this.attackCooldownTimer = new Timer_1.default(3000);
        this.moveTimer = new Timer_1.default(3000);
        this.dir = Vec2_1.default.LEFT;
    }
    update(deltaT) {
        const followRange = 200;
        const attackRange = 20;
        const distanceToPlayer = this.owner.position.distanceTo(this.player.position);
        if (!this.owner.frozen) {
            if (distanceToPlayer < attackRange && this.attackCooldownTimer.isStopped()) {
                this.owner.animation.play("ATTACKING", false, AAEvents_1.AAEvents.PLAYER_HIT);
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.attackCooldownTimer.start();
            }
            else if (distanceToPlayer < followRange) {
                const playerDir = this.player.position.clone().sub(this.owner.position);
                const speed = 20;
                if (playerDir.x < -5) {
                    this.owner._velocity.x = -speed;
                }
                else if (playerDir.x > 5) {
                    this.owner._velocity.x = speed;
                }
                else {
                    this.owner._velocity.x = 0;
                }
                if (playerDir.y < -5) {
                    this.owner._velocity.y = -speed;
                }
                else if (playerDir.y > 5) {
                    this.owner._velocity.y = speed;
                }
                else {
                    this.owner._velocity.y = 0;
                }
                if (!this.owner.animation.isPlaying("ATTACKING") &&
                    !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                    this.owner.animation.playIfNotAlready("RUNNING", true);
                }
                this.owner.rotation = -playerDir.angleToCCW(Vec2_1.default.UP);
            }
            else if (this.moveTimer.isStopped()) {
                if (!this.owner.animation.isPlaying("ATTACKING") &&
                    !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                    this.owner.animation.playIfNotAlready("RUNNING", true);
                }
                if (this.dir.equals(Vec2_1.default.RIGHT)) {
                    this.dir = Vec2_1.default.LEFT;
                }
                else {
                    this.dir = Vec2_1.default.RIGHT;
                }
                this.moveTimer.start();
            }
            this.owner.move(this.owner._velocity.scaled(deltaT));
        }
    }
}
exports.default = AntBehavior;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/GameEventType":27,"../../../../Wolfie2D/Timing/Timer":95,"../../../AAEvents":106,"../NPCBehavior":110}],112:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const AAEvents_1 = require("../../../AAEvents");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const BossStates_1 = require("../NPCStates/BossStates");
const AQIdle_1 = __importDefault(require("../NPCStates/AQIdle"));
const AQAttack_1 = __importDefault(require("../NPCStates/AQAttack"));
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
class AntQueenBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.started = false;
        this.owner = owner;
        this.player = options.player;
        this.weaponSystem = options.particles;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        // Add all states
        this.addState(BossStates_1.AQStates.IDLE, new AQIdle_1.default(this, this.owner));
        //this.addState(MFStates.RUN, new MFRun(this, this.owner));
        this.addState(BossStates_1.AQStates.ATTACK, new AQAttack_1.default(this, this.owner));
        // Set the start state
        this.initialize(BossStates_1.AQStates.IDLE, {
            dir: -1,
            weaponSystem: this.weaponSystem,
            player: this.player,
        });
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        const playerDir = this.player.position.clone().sub(this.owner.position);
        this.owner.rotation = -playerDir.angleToCCW(Vec2_1.default.UP);
        if (this.owner.getScene().bossDead) {
            this.setActive(false);
        }
        if (!this.started) {
            return;
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.started = true;
                break;
            }
        }
    }
}
exports.default = AntQueenBehavior;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/Receiver":28,"../../../AAEvents":106,"../NPCBehavior":110,"../NPCStates/AQAttack":118,"../NPCStates/AQIdle":119,"../NPCStates/BossStates":124}],113:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const AAEvents_1 = require("../../../AAEvents");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const BossStates_1 = require("../NPCStates/BossStates");
const B2Charge_1 = __importDefault(require("../NPCStates/Boss2States/B2Charge"));
const B2Dead_1 = __importDefault(require("../NPCStates/Boss2States/B2Dead"));
const B2Idle_1 = __importDefault(require("../NPCStates/Boss2States/B2Idle"));
class Boss2Behavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.started = false;
        this.owner = owner;
        this.player = options.player;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
        // Add all states
        this.addState(BossStates_1.Boss2States.IDLE, new B2Idle_1.default(this, this.owner));
        this.addState(BossStates_1.Boss2States.CHARGE, new B2Charge_1.default(this, this.owner));
        this.addState(BossStates_1.Boss2States.DEAD, new B2Dead_1.default(this, this.owner));
        this.initialize(BossStates_1.Boss2States.IDLE, { dir: -1 });
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (!this.started) {
            return;
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.started = true;
                break;
            }
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                break;
            }
        }
    }
}
exports.default = Boss2Behavior;
},{"../../../../Wolfie2D/Events/Receiver":28,"../../../AAEvents":106,"../NPCBehavior":110,"../NPCStates/Boss2States/B2Charge":120,"../NPCStates/Boss2States/B2Dead":121,"../NPCStates/Boss2States/B2Idle":122,"../NPCStates/BossStates":124}],114:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const AAEvents_1 = require("../../../AAEvents");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const MFRun_1 = __importDefault(require("../NPCStates/MFRun"));
const BossStates_1 = require("../NPCStates/BossStates");
const MFIdle_1 = __importDefault(require("../NPCStates/MFIdle"));
const MFAttack_1 = __importDefault(require("../NPCStates/MFAttack"));
const MFDead_1 = __importDefault(require("../NPCStates/MFDead"));
class MindFlayerBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.started = false;
        this.owner = owner;
        this.player = options.player;
        this.weaponSystem = options.particles;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
        // Add all states
        this.addState(BossStates_1.MFStates.IDLE, new MFIdle_1.default(this, this.owner));
        this.addState(BossStates_1.MFStates.RUN, new MFRun_1.default(this, this.owner));
        this.addState(BossStates_1.MFStates.ATTACK, new MFAttack_1.default(this, this.owner));
        this.addState(BossStates_1.MFStates.DEAD, new MFDead_1.default(this, this.owner));
        // Set the start state
        this.initialize(BossStates_1.MFStates.IDLE, { dir: 1, weaponSystem: this.weaponSystem });
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.owner.getScene().bossDead) {
            this.setActive(false);
        }
        if (!this.started) {
            return;
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.started = true;
                break;
            }
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                this.weaponSystem.stopSystem();
                break;
            }
        }
    }
}
exports.default = MindFlayerBehavior;
},{"../../../../Wolfie2D/Events/Receiver":28,"../../../AAEvents":106,"../NPCBehavior":110,"../NPCStates/BossStates":124,"../NPCStates/MFAttack":125,"../NPCStates/MFDead":126,"../NPCStates/MFIdle":127,"../NPCStates/MFRun":128}],115:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyStates = void 0;
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
const MathUtils_1 = __importDefault(require("../../../../Wolfie2D/Utils/MathUtils"));
exports.EnemyStates = {
    IDLE: "IDLE",
};
class RangedEnemyBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.owner = owner;
        this.gravity = 4000;
        this.player = options.player;
        this.weaponSystem = options.particles;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.attackCooldownTimer = new Timer_1.default(3000);
        this.moveTimer = new Timer_1.default(3000);
        this.runTimer = new Timer_1.default(1000);
        this.dir = Vec2_1.default.LEFT;
        this.speed = 10;
    }
    update(deltaT) {
        let playerDir = this.player.position.x > this.owner.position.x ? 1 : -1;
        let yRange = Math.abs(this.player.position.y - this.owner.position.y);
        /**
         * if player is in attack range 70-125 -> shoot and run away
         * if player is in follow range 175 -> follow
         * if player is out of range -> do normal pace
         */
        if (!this.owner.frozen) {
            // attack if done running away and can attack and player is between 70 and 125 units
            if (yRange <= 50 &&
                this.owner.position.distanceTo(this.player.position) >= 70 &&
                this.owner.position.distanceTo(this.player.position) <= 125 &&
                this.runTimer.isStopped() &&
                this.attackCooldownTimer.isStopped()) {
                this.speed = 0;
                let diff = this.player.position.clone().sub(this.owner.position);
                let rotation = diff.angleToCCW(Vec2_1.default.RIGHT);
                this.weaponSystem.rotation = rotation;
                if (playerDir > 0) {
                    // this.owner.animation.playIfNotAlready("ATTACKING_RIGHT", false);
                    this.weaponSystem.startSystem(1000, 0, this.owner.position);
                }
                else {
                    this.owner.animation.playIfNotAlready("ATTACKING_LEFT", false);
                    this.weaponSystem.startSystem(1000, 0, this.owner.position);
                }
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.attackCooldownTimer.start();
            }
            // idle if done attacking and player is between 70 and 125 units
            else if (yRange <= 50 &&
                this.owner.position.distanceTo(this.player.position) >= 70 &&
                this.owner.position.distanceTo(this.player.position) <= 125) {
                if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                    !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                    !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                    this.speed = 0;
                    this.owner.animation.playIfNotAlready("IDLE", true);
                }
            }
            // attack if can attack and player is within 70 units
            else if (yRange <= 50 &&
                this.owner.position.distanceTo(this.player.position) < 70 &&
                this.attackCooldownTimer.isStopped()) {
                this.speed = 0;
                let diff = this.player.position.clone().sub(this.owner.position);
                let rotation = diff.angleToCCW(Vec2_1.default.RIGHT);
                this.weaponSystem.rotation = rotation;
                if (playerDir > 0) {
                    this.owner.animation.playIfNotAlready("ATTACKING_RIGHT", false);
                    this.weaponSystem.startSystem(1000, 0, this.owner.position);
                }
                else {
                    // this.owner.animation.playIfNotAlready("ATTACKING_LEFT", false);
                    this.weaponSystem.startSystem(1000, 0, this.owner.position);
                }
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.attackCooldownTimer.start();
            }
            // run away for 1 second if can run and player is within 70 units
            else if (this.owner.position.distanceTo(this.player.position) < 70 &&
                this.runTimer.isStopped() &&
                !this.attackCooldownTimer.isStopped()) {
                this.speed = 20;
                if (playerDir > 0) {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
                else {
                    this.dir = Vec2_1.default.RIGHT;
                    // this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                this.runTimer.start();
            }
            // chase if player is within 125 - 175 units
            else if (this.owner.position.distanceTo(this.player.position) > 125 &&
                this.owner.position.distanceTo(this.player.position) <= 175) {
                this.speed = 10;
                if (playerDir > 0) {
                    this.dir = Vec2_1.default.RIGHT;
                    // this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                else {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
            }
            // normal if player is too far away
            else if (this.owner.position.distanceTo(this.player.position) > 175 &&
                this.moveTimer.isStopped()) {
                this.speed = 10;
                if (this.dir.equals(Vec2_1.default.RIGHT)) {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
                else {
                    this.dir = Vec2_1.default.RIGHT;
                    // this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                this.moveTimer.start();
            }
            // if will fall off then don't move
            if (this.dir.equals(Vec2_1.default.RIGHT)) {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) + 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                        !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
            else {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) - 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                        !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
            if (this.dir !== Vec2_1.default.ZERO) {
                this.owner.invertX = MathUtils_1.default.sign(this.dir.x) > 0;
            }
        }
        this.owner._velocity.x = this.speed * this.dir.x;
        this.owner._velocity.y += this.gravity * deltaT;
        this.owner.move(this.owner._velocity.scaled(deltaT));
    }
}
exports.default = RangedEnemyBehavior;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/GameEventType":27,"../../../../Wolfie2D/Timing/Timer":95,"../../../../Wolfie2D/Utils/MathUtils":100,"../NPCBehavior":110}],116:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyStates = void 0;
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
const AAEvents_1 = require("../../../AAEvents");
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
exports.EnemyStates = {
    IDLE: "IDLE",
};
class ScabberBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.owner = owner;
        this.gravity = 4000;
        this.player = options.player;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.attackCooldownTimer = new Timer_1.default(3000);
        this.moveTimer = new Timer_1.default(3000);
        this.dir = Vec2_1.default.LEFT;
        this.speed = 10;
    }
    update(deltaT) {
        let playerDir = this.player.position.x > this.owner.position.x ? 1 : -1;
        /** if player is in attack range 20 -> attack
         *  if player is in follow range 50 -> follow
         *  if player is out of range -> do normal pace
         */
        if (!this.owner.frozen) {
            if (this.owner.position.distanceTo(this.player.position) < 20 &&
                this.attackCooldownTimer.isStopped()) {
                if (playerDir > 0) {
                    this.owner.animation.playIfNotAlready("ATTACKING_RIGHT", false, AAEvents_1.AAEvents.PLAYER_HIT);
                }
                else {
                    this.owner.animation.playIfNotAlready("ATTACKING_LEFT", false, AAEvents_1.AAEvents.PLAYER_HIT);
                }
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.attackCooldownTimer.start();
            }
            else if (this.owner.position.distanceTo(this.player.position) < 20) {
                if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                    !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                    !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                    this.owner.animation.playIfNotAlready("IDLE", true);
                }
            }
            else if (this.owner.position.distanceTo(this.player.position) < 50) {
                this.speed = 10;
                if (playerDir > 0) {
                    this.dir = Vec2_1.default.RIGHT;
                    this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                else {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
            }
            else if (this.moveTimer.isStopped()) {
                this.speed = 10;
                if (this.dir.equals(Vec2_1.default.RIGHT)) {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
                else {
                    this.dir = Vec2_1.default.RIGHT;
                    this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                this.moveTimer.start();
            }
            // if will fall off then don't move
            if (this.dir.equals(Vec2_1.default.RIGHT)) {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) + 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                        !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
            else {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) - 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
        }
        this.owner._velocity.x = this.speed * this.dir.x;
        this.owner._velocity.y += this.gravity * deltaT;
        this.owner.move(this.owner._velocity.scaled(deltaT));
    }
}
exports.default = ScabberBehavior;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/GameEventType":27,"../../../../Wolfie2D/Timing/Timer":95,"../../../AAEvents":106,"../NPCBehavior":110}],117:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyStates = void 0;
const NPCBehavior_1 = __importDefault(require("../NPCBehavior"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
const AAEvents_1 = require("../../../AAEvents");
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
const MathUtils_1 = __importDefault(require("../../../../Wolfie2D/Utils/MathUtils"));
exports.EnemyStates = {
    IDLE: "IDLE",
};
class XvartBehavior extends NPCBehavior_1.default {
    initializeAI(owner, options) {
        super.initializeAI(owner, options);
        this.owner = owner;
        this.ownerHealth = this.owner.health;
        this.gravity = 4000;
        this.player = options.player;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.attackCooldownTimer = new Timer_1.default(2000);
        this.moveTimer = new Timer_1.default(3000);
        this.damageAnimationTimer = new Timer_1.default(1000, () => {
            // if (this.owner) {
            //     this.owner.animation.play(this.prevAnimation);
            // }
        });
        this.dir = Vec2_1.default.LEFT;
        this.speed = 40;
    }
    update(deltaT) {
        const playerDir = this.player.position.x > this.owner.position.x ? 1 : -1;
        const faceDir = this.owner._velocity.x > 0 ? 1 : -1;
        if (this.owner.health < this.ownerHealth) {
            // this.prevAnimation = this.owner.animation.getCurrent();
            // if (faceDir === 1) {
            //     this.owner.animation.playIfNotAlready("TAKING_DAMAGE_RIGHT");
            // } else {
            //     this.owner.animation.playIfNotAlready("TAKING_DAMAGE_LEFT");
            // }
            this.ownerHealth = this.owner.health;
            this.damageAnimationTimer.start();
        }
        /** if player is in attack range 20 -> attack
         *  if player is in follow range 50 -> follow
         *  if player is out of range -> do normal pace
         */
        if (!this.owner.frozen && this.damageAnimationTimer.isStopped()) {
            if (this.owner.position.distanceTo(this.player.position) < 40 &&
                this.attackCooldownTimer.isStopped()) {
                if (playerDir > 0) {
                    this.owner.animation.playIfNotAlready("ATTACKING_LEFT", false, AAEvents_1.AAEvents.PLAYER_HIT);
                }
                else {
                    this.owner.animation.playIfNotAlready("ATTACKING_LEFT", false, AAEvents_1.AAEvents.PLAYER_HIT);
                }
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.attackCooldownTimer.start();
            }
            else if (this.owner.position.distanceTo(this.player.position) < 20) {
                if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                    !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                    !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                    this.owner.animation.playIfNotAlready("IDLE", true);
                }
            }
            else if (this.owner.position.distanceTo(this.player.position) < 200 &&
                !this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                this.speed = 40;
                if (playerDir > 0) {
                    this.dir = Vec2_1.default.RIGHT;
                    // this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                else {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
            }
            else if (this.moveTimer.isStopped() &&
                !this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                this.speed = 40;
                if (this.dir.equals(Vec2_1.default.RIGHT)) {
                    this.dir = Vec2_1.default.LEFT;
                    this.owner.animation.playIfNotAlready("MOVING_LEFT", true);
                }
                else {
                    this.dir = Vec2_1.default.RIGHT;
                    // this.owner.animation.playIfNotAlready("MOVING_RIGHT", true);
                }
                this.moveTimer.start();
            }
            // if will fall off then don't move
            if (this.dir.equals(Vec2_1.default.RIGHT)) {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) + 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                        !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
            else {
                if (this.tilemap.getTileAtRowCol(new Vec2_1.default(Math.floor(this.owner.position.x / 16) - 1, Math.floor(this.owner.position.y / 16) + 1)) == 0) {
                    this.speed = 0;
                    if (!this.owner.animation.isPlaying("ATTACKING_LEFT") &&
                        !this.owner.animation.isPlaying("ATTACKING_RIGHT") &&
                        !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
                        this.owner.animation.playIfNotAlready("IDLE", true);
                    }
                }
            }
            if (this.dir !== Vec2_1.default.ZERO) {
                this.owner.invertX = MathUtils_1.default.sign(this.dir.x) > 0;
            }
        }
        this.owner._velocity.x = this.speed * this.dir.x;
        this.owner._velocity.y += this.gravity * deltaT;
        this.owner.move(this.owner._velocity.scaled(deltaT));
    }
}
exports.default = XvartBehavior;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/GameEventType":27,"../../../../Wolfie2D/Timing/Timer":95,"../../../../Wolfie2D/Utils/MathUtils":100,"../../../AAEvents":106,"../NPCBehavior":110}],118:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AAEvents_1 = require("../../../AAEvents");
const BossStates_1 = require("./BossStates");
const BossState_1 = __importDefault(require("./BossState"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
const Vec2_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/Vec2"));
class AQAttack extends BossState_1.default {
    onEnter(options) {
        this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;
        this.player = options.player;
        this.attack();
        this.finished(BossStates_1.AQStates.IDLE);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    attack() {
        if (this.owner.getScene().bossDead) {
            console.log("boss dead");
            return;
        }
        let diff = this.player.position.clone().sub(this.owner.position);
        let rotation = diff.angleToCCW(Vec2_1.default.DOWN);
        this.weaponSystem.rotation = rotation;
        this.owner.animation.playIfNotAlready("ATTACKING", false);
        this.weaponSystem.startSystem(1000, 0, this.owner.position);
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.owner.getScene().getAttackAudioKey(),
            loop: false,
            holdReference: false,
        });
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                break;
            }
        }
    }
    onExit() {
        return {
            dir: this.dir,
            started: true,
            player: this.player,
            weaponSystem: this.weaponSystem,
            prevState: BossStates_1.AQStates.ATTACK,
        };
    }
}
exports.default = AQAttack;
},{"../../../../Wolfie2D/DataTypes/Vec2":21,"../../../../Wolfie2D/Events/GameEventType":27,"../../../AAEvents":106,"./BossState":123,"./BossStates":124}],119:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnemyController_1 = require("../../../Enemy/EnemyController");
const AAEvents_1 = require("../../../AAEvents");
const BossStates_1 = require("./BossStates");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const BossState_1 = __importDefault(require("./BossState"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
class AQIdle extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING IDLE");
        if (!this.owner.animation.isPlaying("ATTACKING") && !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
            this.owner.animation.play(EnemyController_1.EnemyAnimations.IDLE);
        }
        this.parent.speed = this.parent.MIN_SPEED;
        this.player = options.player;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;
        if (options.prevState === BossStates_1.AQStates.ATTACK) {
            this.idleTimer = new Timer_1.default(2000, () => {
                this.finished(BossStates_1.AQStates.IDLE);
            }, false);
        }
        else {
            this.idleTimer = new Timer_1.default(2000, () => {
                this.finished(BossStates_1.AQStates.ATTACK);
            }, false);
        }
        if (options.started) {
            this.idleTimer.start();
        }
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (!this.owner.animation.isPlaying("ATTACKING") && !this.owner.animation.isPlaying("TAKING_DAMAGE")) {
            this.owner.animation.playIfNotAlready(EnemyController_1.EnemyAnimations.IDLE);
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.idleTimer.start();
                break;
            }
        }
    }
    onExit() {
        return {
            dir: this.dir,
            started: true,
            player: this.player,
            weaponSystem: this.weaponSystem,
            prevState: BossStates_1.AQStates.IDLE,
        };
    }
}
exports.default = AQIdle;
},{"../../../../Wolfie2D/Events/Receiver":28,"../../../../Wolfie2D/Timing/Timer":95,"../../../AAEvents":106,"../../../Enemy/EnemyController":143,"./BossState":123,"./BossStates":124}],120:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Receiver_1 = __importDefault(require("../../../../../Wolfie2D/Events/Receiver"));
const MathUtils_1 = __importDefault(require("../../../../../Wolfie2D/Utils/MathUtils"));
const AAEvents_1 = require("../../../../AAEvents");
const BossState_1 = __importDefault(require("../BossState"));
const BossStates_1 = require("../BossStates");
class B2Charge extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING CHARGE");
        this.owner.animation.play("FLOAT");
        this.parent.speed = this.parent.MAX_SPEED * 0.75;
        this.dir = options.dir;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.lockPlayer(this.owner, this.owner.getScene().getViewport().getCenter(), this.owner.getScene().getViewport().getHalfSize());
        if (this.dir !== 0) {
            this.owner.invertX = MathUtils_1.default.sign(this.dir) < 0;
        }
        this.parent.velocity.y += this.gravity * deltaT;
        this.parent.velocity.x = this.dir * this.parent.speed;
        this.owner.move(this.parent.velocity.scaled(deltaT));
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                this.finished(BossStates_1.Boss2States.DEAD);
                break;
            }
        }
    }
    lockPlayer(player, viewportCenter, viewportHalfSize) {
        const playerLeftEdge = player.position.x - player.size.x / 4;
        const playerRightEdge = player.position.x + player.size.x / 4;
        const viewportLeftEdge = viewportCenter.x - viewportHalfSize.x;
        const viewportRightEdge = viewportCenter.x + viewportHalfSize.x;
        if (playerLeftEdge <= viewportLeftEdge) {
            player.position.x = viewportLeftEdge + player.size.x / 4;
            this.dir = 1;
            this.finished(BossStates_1.Boss2States.IDLE);
        }
        else if (playerRightEdge >= viewportRightEdge) {
            player.position.x = viewportRightEdge - player.size.x / 4;
            this.dir = -1;
            this.finished(BossStates_1.Boss2States.IDLE);
        }
    }
    onExit() {
        return {
            dir: this.dir,
            started: true,
            prevState: BossStates_1.Boss2States.CHARGE,
        };
    }
}
exports.default = B2Charge;
},{"../../../../../Wolfie2D/Events/Receiver":28,"../../../../../Wolfie2D/Utils/MathUtils":100,"../../../../AAEvents":106,"../BossState":123,"../BossStates":124}],121:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BossState_1 = __importDefault(require("../BossState"));
/**
 * The Dead state for the player's FSM AI.
 */
class B2Dead extends BossState_1.default {
    // Trigger the player's death animation when we enter the dead state
    onEnter(options) {
        console.log("ENTERING DEAD");
        // this.owner.tweens.play("DEATH");
    }
    // Ignore all events from the rest of the game
    handleInput(event) { }
    // Empty update method - if the boss is dead, don't update anything
    update(deltaT) { }
    onExit() {
        return {};
    }
}
exports.default = B2Dead;
},{"../BossState":123}],122:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Receiver_1 = __importDefault(require("../../../../../Wolfie2D/Events/Receiver"));
const Timer_1 = __importDefault(require("../../../../../Wolfie2D/Timing/Timer"));
const MathUtils_1 = __importDefault(require("../../../../../Wolfie2D/Utils/MathUtils"));
const AAEvents_1 = require("../../../../AAEvents");
const EnemyController_1 = require("../../../../Enemy/EnemyController");
const BossState_1 = __importDefault(require("../BossState"));
const BossStates_1 = require("../BossStates");
class B2Idle extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING IDLE");
        this.owner.animation.play(EnemyController_1.EnemyAnimations.IDLE);
        this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        // if (options.prevState === Boss2States.CHARGE) {
        //     this.idleTimer = new Timer(
        //         2000,
        //         () => {
        //             this.finished(Boss2States.CHARGE);
        //         },
        //         false
        //     );
        // }
        this.idleTimer = new Timer_1.default(2000, () => {
            this.finished(BossStates_1.Boss2States.CHARGE);
        }, false);
        if (options.started) {
            this.idleTimer.start();
        }
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.dir !== 0) {
            this.owner.invertX = MathUtils_1.default.sign(this.dir) < 0;
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.idleTimer.start();
                break;
            }
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                console.log("handling boss killed");
                this.finished(BossStates_1.Boss2States.DEAD);
                break;
            }
        }
    }
    onExit() {
        this.idleTimer.reset();
        return {
            dir: this.dir,
            started: true,
            prevState: BossStates_1.Boss2States.IDLE,
        };
    }
}
exports.default = B2Idle;
},{"../../../../../Wolfie2D/Events/Receiver":28,"../../../../../Wolfie2D/Timing/Timer":95,"../../../../../Wolfie2D/Utils/MathUtils":100,"../../../../AAEvents":106,"../../../../Enemy/EnemyController":143,"../BossState":123,"../BossStates":124}],123:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/State/State"));
/**
 * An abstract state for the PlayerController
 */
class BossState extends State_1.default {
    // protected receiver: Receiver;
    constructor(parent, owner) {
        super(parent);
        this.owner = owner;
        this.gravity = 500;
        // this.receiver = new Receiver();
    }
    /**
     * Handle game events from the parent.
     * @param event the game event
     */
    handleInput(event) {
        switch (event.type) {
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
    }
    update(deltaT) {
        // while (this.receiver.hasNextEvent()) {
        //     this.handleInput(this.receiver.getNextEvent());
        // }
        // this.lockPlayer(
        //     this.owner,
        //     this.owner.getScene().getViewport().getCenter(),
        //     this.owner.getScene().getViewport().getHalfSize()
        // );
    }
    lockPlayer(player, viewportCenter, viewportHalfSize) {
        const playerLeftEdge = player.position.x - player.size.x / 4;
        const playerRightEdge = player.position.x + player.size.x / 4;
        const viewportLeftEdge = viewportCenter.x - viewportHalfSize.x;
        const viewportRightEdge = viewportCenter.x + viewportHalfSize.x;
        if (playerLeftEdge <= viewportLeftEdge) {
            player.position.x = viewportLeftEdge + player.size.x / 4;
        }
        else if (playerRightEdge >= viewportRightEdge) {
            player.position.x = viewportRightEdge - player.size.x / 4;
        }
    }
}
exports.default = BossState;
},{"../../../../Wolfie2D/DataTypes/State/State":18}],124:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AQStates = exports.MFStates = exports.Boss2States = void 0;
exports.Boss2States = {
    IDLE: "IDLE",
    CHARGE: "CHARGE",
    DEAD: "DEAD",
};
exports.MFStates = {
    DEAD: "DEAD",
    RUN_LEFT: "RUN_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    RUN: "RUN",
    ATTACK: "ATTACK",
    IDLE: "IDLE",
};
exports.AQStates = {
    DEAD: "DEAD",
    ATTACK: "ATTACK",
    IDLE: "IDLE",
};
},{}],125:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AAEvents_1 = require("../../../AAEvents");
const BossStates_1 = require("./BossStates");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const BossState_1 = __importDefault(require("./BossState"));
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
class MFAttack extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING ATTACK");
        this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;
        this.attack();
        this.finished(BossStates_1.MFStates.IDLE);
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    attack() {
        if (this.owner.getScene().bossDead) {
            return;
        }
        this.owner.invertX = this.dir === 1 ? true : false;
        this.owner.animation.playIfNotAlready("CASTING_LEFT", false);
        this.weaponSystem.setDir(this.dir);
        this.weaponSystem.startSystem(1000, 0, this.owner.position);
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.owner.getScene().getAttackAudioKey(),
            loop: false,
            holdReference: false,
        });
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                break;
            }
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                this.finished(BossStates_1.MFStates.DEAD);
                break;
            }
        }
    }
    onExit() {
        return {
            dir: this.dir,
            started: true,
            weaponSystem: this.weaponSystem,
            prevState: BossStates_1.MFStates.ATTACK,
        };
    }
}
exports.default = MFAttack;
},{"../../../../Wolfie2D/Events/GameEventType":27,"../../../../Wolfie2D/Events/Receiver":28,"../../../AAEvents":106,"./BossState":123,"./BossStates":124}],126:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BossState_1 = __importDefault(require("./BossState"));
/**
 * The Dead state for the player's FSM AI.
 */
class MFDead extends BossState_1.default {
    // Trigger the player's death animation when we enter the dead state
    onEnter(options) {
        console.log("ENTERING DEAD");
        // this.owner.tweens.play("DEATH");
        options.weaponSystem.stopSystem();
    }
    // Ignore all events from the rest of the game
    handleInput(event) { }
    // Empty update method - if the boss is dead, don't update anything
    update(deltaT) { }
    onExit() {
        return {};
    }
}
exports.default = MFDead;
},{"./BossState":123}],127:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnemyController_1 = require("../../../Enemy/EnemyController");
const AAEvents_1 = require("../../../AAEvents");
const BossStates_1 = require("./BossStates");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
const BossState_1 = __importDefault(require("./BossState"));
const Timer_1 = __importDefault(require("../../../../Wolfie2D/Timing/Timer"));
class MFIdle extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING IDLE");
        if (this.owner.animation.isPlaying("CASTING_LEFT")) {
            this.owner.animation.queue(EnemyController_1.EnemyAnimations.IDLE, true);
        }
        else {
            this.owner.animation.play(EnemyController_1.EnemyAnimations.IDLE, true);
        }
        this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;
        if (options.prevState === BossStates_1.MFStates.ATTACK) {
            this.idleTimer = new Timer_1.default(2000, () => {
                this.finished(BossStates_1.MFStates.RUN);
            }, false);
        }
        else {
            this.idleTimer = new Timer_1.default(2000, () => {
                this.finished(BossStates_1.MFStates.ATTACK);
            }, false);
        }
        if (options.started) {
            this.idleTimer.start();
        }
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.owner.onGround) {
            return;
        }
        // this.parent.velocity.y += this.gravity * deltaT;
        // this.owner.move(this.parent.velocity.scaled(deltaT));
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.idleTimer.start();
                break;
            }
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                console.log("handling boss killed");
                this.finished(BossStates_1.MFStates.DEAD);
                break;
            }
        }
    }
    onExit() {
        this.idleTimer.reset();
        return {
            dir: this.dir,
            started: true,
            weaponSystem: this.weaponSystem,
            prevState: BossStates_1.MFStates.IDLE,
        };
    }
}
exports.default = MFIdle;
},{"../../../../Wolfie2D/Events/Receiver":28,"../../../../Wolfie2D/Timing/Timer":95,"../../../AAEvents":106,"../../../Enemy/EnemyController":143,"./BossState":123,"./BossStates":124}],128:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BossState_1 = __importDefault(require("./BossState"));
const BossStates_1 = require("./BossStates");
const AAEvents_1 = require("../../../AAEvents");
const Receiver_1 = __importDefault(require("../../../../Wolfie2D/Events/Receiver"));
class Run extends BossState_1.default {
    onEnter(options) {
        console.log("ENTERING RUN");
        this.owner.animation.play("MOVING_LEFT");
        this.parent.speed = this.parent.MAX_SPEED;
        this.dir = options.dir;
        this.weaponSystem = options.weaponSystem;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.BOSS_KILLED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.parent.velocity.y += this.gravity * deltaT;
        this.parent.velocity.x = this.dir * this.parent.speed;
        this.owner.move(this.parent.velocity.scaled(deltaT));
        this.lockPlayer(this.owner, this.owner.getScene().getViewport().getCenter(), this.owner.getScene().getViewport().getHalfSize());
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.BOSS_KILLED: {
                this.finished(BossStates_1.MFStates.DEAD);
                break;
            }
        }
    }
    lockPlayer(player, viewportCenter, viewportHalfSize) {
        const playerLeftEdge = player.position.x - player.size.x / 4;
        const playerRightEdge = player.position.x + player.size.x / 4;
        const viewportLeftEdge = viewportCenter.x - viewportHalfSize.x;
        const viewportRightEdge = viewportCenter.x + viewportHalfSize.x;
        if (playerLeftEdge <= viewportLeftEdge) {
            player.position.x = viewportLeftEdge + player.size.x / 4 + 10;
            this.dir = 1;
            this.finished(BossStates_1.MFStates.IDLE);
        }
        else if (playerRightEdge >= viewportRightEdge) {
            player.position.x = viewportRightEdge - player.size.x / 4 - 10;
            this.dir = -1;
            this.finished(BossStates_1.MFStates.IDLE);
        }
    }
    onExit() {
        return {
            dir: this.dir,
            started: true,
            weaponSystem: this.weaponSystem,
            prevState: BossStates_1.MFStates.RUN,
        };
    }
}
exports.default = Run;
},{"../../../../Wolfie2D/Events/Receiver":28,"../../../AAEvents":106,"./BossState":123,"./BossStates":124}],129:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class RangedEnemyParticles extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        this.targetPosition = Vec2_1.default.ZERO;
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
    }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() {
        return this.systemRunning;
    }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() {
        return this.particlePool;
    }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        particle.vel = new Vec2_1.default(150, 0);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        // particle.vel.rotateCCW(Math.PI - 0.11181977801753654);
        particle.color = Color_1.default.ORANGE;
        if (!particle.tweens) {
            return;
        }
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE,
                },
            ],
        });
    }
    setTarget(vec) {
        this.targetPosition = vec;
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY_PARTICLE);
        }
    }
}
exports.default = RangedEnemyParticles;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../AAPhysicsGroups":107}],130:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const RandUtils_1 = __importDefault(require("../../../Wolfie2D/Utils/RandUtils"));
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class FireParticles extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        this.particleVec = Vec2_1.default.ZERO;
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() { return this._rotation; }
    set rotation(rotation) { this._rotation = rotation; }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() { return this.systemRunning; }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() { return this.particlePool; }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        particle.vel = RandUtils_1.default.randVec(this.particleVec.x - 50, this.particleVec.x + 50, this.particleVec.y - 50, this.particleVec.y + 50);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        const colors = [Color_1.default.RED, Color_1.default.YELLOW, Color_1.default.ORANGE];
        particle.color = colors[RandUtils_1.default.randInt(0, 3)];
        if (!particle.tweens) {
            return;
        }
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE
                }
            ]
        });
    }
    setParticleVector(vec) {
        this.particleVec = vec.mult(new Vec2_1.default(0.2, 0.2));
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.FIRE_PARTICLE);
        }
    }
}
exports.default = FireParticles;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../../Wolfie2D/Utils/RandUtils":101,"../../AAPhysicsGroups":107}],131:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class Fireball extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() { return this._rotation; }
    set rotation(rotation) { this._rotation = rotation; }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() { return this.systemRunning; }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() { return this.particlePool; }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        //particle.vel = RandUtils.randVec(-32, 32, 100, 200);
        particle.vel = new Vec2_1.default(0, 300);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        particle.color = Color_1.default.RED;
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE
                }
            ]
        });
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL);
        }
        // this.gravity = 500;
        this.gravity = 0; // just disabling gravity for now
    }
    update(deltaT) {
        super.update(deltaT);
        if (this.particlePool.length > 0 && this.isSystemRunning()) {
            let particle = this.particlePool[0];
            if (particle) {
                particle.vel.y += this.gravity * deltaT;
                particle.move(particle.vel.scaled(deltaT));
            }
        }
    }
}
exports.default = Fireball;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../AAPhysicsGroups":107}],132:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../../Wolfie2D/Utils/EaseFunctions");
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
/**
 * The particle system used for the player's weapon
 */
class IceParticles extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        this.particleVec = Vec2_1.default.ZERO;
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() { return this._rotation; }
    set rotation(rotation) { this._rotation = rotation; }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() { return this.systemRunning; }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() { return this.particlePool; }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        particle.vel = new Vec2_1.default(0, 450);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        particle.color = Color_1.default.CYAN;
        if (!particle.tweens) {
            return;
        }
        // Give the particle tweens
        particle.tweens.add("active", {
            startDelay: 0,
            duration: this.lifetime,
            effects: [
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_SINE
                }
            ]
        });
    }
    setParticleVector(vec) {
        this.particleVec = vec.mult(new Vec2_1.default(0.2, 0.2));
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE);
        }
    }
}
exports.default = IceParticles;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../../Wolfie2D/Utils/EaseFunctions":98,"../../AAPhysicsGroups":107}],133:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerStates = exports.PlayerTweens = exports.PlayerAnimations = void 0;
const StateMachineAI_1 = __importDefault(require("../../../Wolfie2D/AI/StateMachineAI"));
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
const Fall_1 = __importDefault(require("./PlayerStates/Fall"));
const Idle_1 = __importDefault(require("./PlayerStates/Idle"));
const Jump_1 = __importDefault(require("./PlayerStates/Jump"));
const Run_1 = __importDefault(require("./PlayerStates/Run"));
const Input_1 = __importDefault(require("../../../Wolfie2D/Input/Input"));
const AAControls_1 = require("../../AAControls");
const MathUtils_1 = __importDefault(require("../../../Wolfie2D/Utils/MathUtils"));
const AAEvents_1 = require("../../AAEvents");
const Dead_1 = __importDefault(require("./PlayerStates/Dead"));
const Receiver_1 = __importDefault(require("../../../Wolfie2D/Events/Receiver"));
const SpellTypes_1 = require("./SpellTypes");
const GameEventType_1 = require("../../../Wolfie2D/Events/GameEventType");
const Timer_1 = __importDefault(require("../../../Wolfie2D/Timing/Timer"));
const MainMenu_1 = __importDefault(require("../../Scenes/MainMenu"));
/**
 * Animation keys for the player spritesheet
 */
exports.PlayerAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    JUMP: "JUMP",
    FALL: "FALL",
    ATTACK: "ATTACK",
    TAKING_DAMAGE: "TAKING_DAMAGE",
    DYING: "DYING",
    JUMP_ATTACK: "JUMP_ATTACK",
};
/**
 * Tween animations the player can player.
 */
exports.PlayerTweens = {
    FLIP: "FLIP",
    DEATH: "DEATH",
};
/**
 * Keys for the states the PlayerController can be in.
 */
exports.PlayerStates = {
    IDLE: "IDLE",
    RUN: "RUN",
    JUMP: "JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
};
/**
 * The controller that controls the player.
 */
class PlayerController extends StateMachineAI_1.default {
    constructor() {
        super(...arguments);
        this.MAX_SPEED = 300;
        this.MIN_SPEED = 130;
    }
    initializeAI(owner, options) {
        this.owner = owner;
        this.tongueGraphic = options.tongueGraphic;
        //this.weapon = options.weaponSystem;
        this.fireParticles = options.fireParticleSystem;
        this.fireProjectile = options.fireballSystem;
        this.tongueProjectile = options.tongueParticleSystem;
        this.iceParticles = options.iceParticleSystem;
        this.npcs = options.allNPCs;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.speed = 400;
        this.velocity = Vec2_1.default.ZERO;
        this.health = 5;
        this.maxHealth = 5;
        this._previousHealth = this.health;
        this.isFirejumpActive = false;
        this.isGrappleActive = false;
        // Add the different states the player can be in to the PlayerController
        this.addState(exports.PlayerStates.IDLE, new Idle_1.default(this, this.owner));
        this.addState(exports.PlayerStates.RUN, new Run_1.default(this, this.owner));
        this.addState(exports.PlayerStates.JUMP, new Jump_1.default(this, this.owner));
        this.addState(exports.PlayerStates.FALL, new Fall_1.default(this, this.owner));
        this.addState(exports.PlayerStates.DEAD, new Dead_1.default(this, this.owner));
        // Start the player in the Idle state
        this.initialize(exports.PlayerStates.IDLE);
        this.selectedSpell = SpellTypes_1.SpellTypes.TONGUE;
        // this.selectedSpell = SpellTypes.FIREBALL;
        this.isInvincible = false;
        this.iFramesTimer = new Timer_1.default(2000, null, false);
        this.tongueCooldown = new Timer_1.default(1000, null, false);
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_FIRE_JUMP);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_SWING);
        this.receiver.subscribe(AAEvents_1.AAEvents.TOGGLE_INVINCIBILITY);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_HIT);
        this.receiver.subscribe(AAEvents_1.AAEvents.KILL_PLAYER);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_HEAL);
        this.emitter.fireEvent(AAEvents_1.AAEvents.HEALTH_CHANGE, {
            curhp: this.health,
            maxhp: this.maxHealth,
        });
    }
    handleEvent(event) {
        switch (event.type) {
            // Move player on a fireball jump
            case AAEvents_1.AAEvents.PLAYER_FIRE_JUMP: {
                const vel = event.data.get("fireJumpVel");
                const playerPos = event.data.get("playerPos");
                const particlePos = event.data.get("particlePos");
                // attempt to scale movement vector by difference in position
                const posDiff = MathUtils_1.default.clamp(playerPos.clone().distanceTo(particlePos), 0, 50);
                const scaleFactor = posDiff >= 50
                    ? 0
                    : MathUtils_1.default.clamp(Math.pow(25, 0.8) - 0.7 * Math.pow(posDiff, 0.8), 0, 8);
                this.velocity.x += vel.clone().scale(scaleFactor).x;
                this.velocity.y += vel.clone().scale(scaleFactor).y;
                this.isFirejumpActive = true;
                console.log("posDiff: " + posDiff + ", scaleFactor: " + scaleFactor);
                break;
            }
            case AAEvents_1.AAEvents.KILL_PLAYER: {
                this.owner.health = 0;
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_SWING: {
                const dir = event.data.get("swingDir");
                // const playerPos: Vec2 = event.data.get("playerPos");
                // const particlePos: Vec2 = event.data.get("particlePos");
                this.velocity.mult(Vec2_1.default.ZERO);
                this.velocity.add(dir);
                // // Calculate the distance between the player and the grapple point
                // const posDiff = playerPos.clone().distanceTo(particlePos);
                // // Scale the velocity based on the distance between the player and the grapple point
                // const minSwingDist = 5; // The minimum distance for a successful swing
                // const maxSwingDist = 20; // The maximum distance for a successful swing
                // let scaleFactor = MathUtils.clamp((posDiff - minSwingDist) / (maxSwingDist - minSwingDist), 0, 1) * 3;
                // // Adjust the scaling factor based on the state of the player
                // if (this.currentState instanceof Fall || this.currentState instanceof Jump) {
                //     scaleFactor *= 1.5;
                // }
                // // Set the velocity of the player
                // this.velocity = dir.clone().scale(scaleFactor);
                this.isGrappleActive = true;
                break;
            }
            case AAEvents_1.AAEvents.TOGGLE_INVINCIBILITY: {
                this.isInvincible = !this.isInvincible;
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_HIT: {
                if (this.iFramesTimer.isStopped()) {
                    this.health -= 1;
                    this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                        key: this.owner.getScene().getHurtAudioKey(),
                        loop: false,
                        holdReference: false,
                    });
                    const enemyId = event.data.get("node") || event.data.get("owner");
                    const enemy = this.npcs.get(enemyId);
                    if (enemy) {
                        // Push the player a bit in the direction they were hit
                        const dir = enemy.position.dirTo(this.owner.position);
                        this.velocity.x = dir.x >= 0 ? this.velocity.x + 100 : this.velocity.x - 100;
                        this.velocity.y -= 100;
                    }
                    this.iFramesTimer.start();
                }
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_HEAL: {
                // if (this.iFramesTimer.isStopped()) {
                //     this.health += 1;
                //     this.iFramesTimer.start();
                // }
                // testing this since you cant regain health from consuming
                // soon after taking damage with previous code
                this.health += 1;
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getHealAudioKey(),
                    loop: false,
                    holdReference: false,
                });
                this.iFramesTimer.start();
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in player controller with type ${event.type}`);
            }
        }
    }
    /**
     * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
     */
    get inputDir() {
        let direction = Vec2_1.default.ZERO;
        direction.x =
            (Input_1.default.isPressed(AAControls_1.AAControls.MOVE_LEFT) ? -1 : 0) +
                (Input_1.default.isPressed(AAControls_1.AAControls.MOVE_RIGHT) ? 1 : 0);
        direction.y = Input_1.default.isJustPressed(AAControls_1.AAControls.JUMP) ? -1 : 0;
        return direction;
    }
    /**
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    get faceDir() {
        return this.owner.position.dirTo(Input_1.default.getGlobalMousePosition());
    }
    update(deltaT) {
        super.update(deltaT);
        // TODO not sure if should be before or after super call
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // Update the rotation to apply the particles velocity vector
        //this.fireParticles.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.faceDir) + Math.PI;
        this.fireProjectile.rotation = 2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
        this.tongueProjectile.rotation = 2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
        this.iceParticles.rotation = 2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
        // Attack
        if (Input_1.default.isMouseJustPressed()) {
            //this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(Input.getGlobalMousePosition()),5);
            switch (this.selectedSpell) {
                case SpellTypes_1.SpellTypes.TONGUE: {
                    this.tongueAttack();
                    break;
                }
                case SpellTypes_1.SpellTypes.FIREBALL: {
                    this.fireballAttack();
                    break;
                }
                case SpellTypes_1.SpellTypes.ICE: {
                    this.iceAttack();
                    break;
                }
                default: {
                    throw new Error(`Unhandled attack type ${this.selectedSpell} caught in handlePlayerAttack()`);
                }
            }
            this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_ATTACK);
        }
        // Set the selected spell
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.SELECT_TONGUE)) {
            if (MainMenu_1.default.CURRENT_LEVEL >= 1) {
                this.selectedSpell = SpellTypes_1.SpellTypes.TONGUE;
                this.emitter.fireEvent(AAEvents_1.AAEvents.SELECT_TONGUE);
            }
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.SELECT_FIREBALL)) {
            if (MainMenu_1.default.CURRENT_LEVEL >= 3) {
                this.selectedSpell = SpellTypes_1.SpellTypes.FIREBALL;
                this.emitter.fireEvent(AAEvents_1.AAEvents.SELECT_FIREBALL);
            }
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.SELECT_ICE)) {
            if (MainMenu_1.default.CURRENT_LEVEL >= 5) {
                this.selectedSpell = SpellTypes_1.SpellTypes.ICE;
                this.emitter.fireEvent(AAEvents_1.AAEvents.SELECT_ICE);
            }
        }
        // Handles pausing the game
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.PAUSE)) {
            this.emitter.fireEvent(AAEvents_1.AAEvents.PAUSE);
        }
        // console.log('velocity: ' + this.velocity);
    }
    tongueAttack() {
        if (this.tongueCooldown.isStopped()) {
            this.tongueCooldown.start();
            if (!this.tongueProjectile.isSystemRunning() && !this.tongueGraphic.visible) {
                this.tongueProjectile.getPool()[0].unfreeze();
                // Update the rotation to apply the particles velocity vector
                this.tongueProjectile.rotation =
                    2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
                // Start the particle system at the player's current position
                this.tongueProjectile.startSystem(1000, 0, this.owner.position);
                if (this.owner.onGround) {
                    this.owner.animation.play(exports.PlayerAnimations.ATTACK);
                }
                else {
                    this.owner.animation.play(exports.PlayerAnimations.JUMP_ATTACK);
                }
                this.emitter.fireEvent(AAEvents_1.AAEvents.SHOOT_TONGUE, {
                    pos: this.owner.position,
                    dir: this.faceDir,
                });
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.owner.getScene().getAttackAudioKey(),
                    loop: false,
                    holdReference: false,
                });
            }
        }
    }
    fireballAttack() {
        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        if (!this.fireProjectile.isSystemRunning() && !this.fireParticles.isSystemRunning()) {
            this.fireProjectile.getPool()[0].unfreeze();
            // Update the rotation to apply the particles velocity vector
            this.fireProjectile.rotation = 2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
            // Start the particle system at the player's current position
            this.fireProjectile.startSystem(500, 0, this.owner.position);
            if (this.owner.onGround) {
                this.owner.animation.play(exports.PlayerAnimations.ATTACK);
            }
            else {
                this.owner.animation.play(exports.PlayerAnimations.JUMP_ATTACK);
            }
            this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                key: this.owner.getScene().getAttackAudioKey(),
                loop: false,
                holdReference: false,
            });
        }
    }
    iceAttack() {
        if (!this.iceParticles.isSystemRunning()) {
            this.iceParticles.getPool()[0].unfreeze();
            // Update the rotation to apply the particles velocity vector
            this.iceParticles.rotation = 2 * Math.PI - Vec2_1.default.UP.angleToCCW(this.faceDir) + Math.PI;
            if (this.owner.onGround) {
                this.owner.animation.play(exports.PlayerAnimations.ATTACK);
            }
            else {
                this.owner.animation.play(exports.PlayerAnimations.JUMP_ATTACK);
            }
            // Start the particle system at the player's current position
            this.iceParticles.startSystem(500, 0, this.owner.position);
            this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                key: this.owner.getScene().getAttackAudioKey(),
                loop: false,
                holdReference: false,
            });
        }
    }
    get velocity() {
        return this._velocity;
    }
    set velocity(velocity) {
        this._velocity = velocity;
    }
    get speed() {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }
    get maxHealth() {
        return this._maxHealth;
    }
    set maxHealth(maxHealth) {
        this._maxHealth = maxHealth;
    }
    get health() {
        return this._health;
    }
    set health(health) {
        if (this.isInvincible) {
            return;
        }
        this._health = MathUtils_1.default.clamp(health, 0, this.maxHealth);
        if (this._previousHealth > this._health) {
            this.owner.animation.playIfNotAlready(exports.PlayerAnimations.TAKING_DAMAGE);
        }
        this._previousHealth = this._health;
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(AAEvents_1.AAEvents.HEALTH_CHANGE, {
            curhp: this.health,
            maxhp: this.maxHealth,
        });
        // If the health hit 0, change the state of the player
        if (this.health === 0) {
            this.changeState(exports.PlayerStates.DEAD);
        }
    }
}
exports.default = PlayerController;
},{"../../../Wolfie2D/AI/StateMachineAI":2,"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Events/GameEventType":27,"../../../Wolfie2D/Events/Receiver":28,"../../../Wolfie2D/Input/Input":29,"../../../Wolfie2D/Timing/Timer":95,"../../../Wolfie2D/Utils/MathUtils":100,"../../AAControls":105,"../../AAEvents":106,"../../Scenes/MainMenu":161,"./PlayerStates/Dead":134,"./PlayerStates/Fall":135,"./PlayerStates/Idle":136,"./PlayerStates/Jump":137,"./PlayerStates/Run":139,"./SpellTypes":140}],134:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AAEvents_1 = require("../../../AAEvents");
const PlayerState_1 = __importDefault(require("./PlayerState"));
/**
 * The Dead state for the player's FSM AI.
 */
class Dead extends PlayerState_1.default {
    // Trigger the player's death animation when we enter the dead state
    onEnter(options) {
        //this.owner.tweens.play(PlayerTweens.DEATH);
        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_DEAD);
    }
    // Ignore all events from the rest of the game
    handleInput(event) { }
    // Empty update method - if the player is dead, don't update anything
    update(deltaT) { }
    onExit() { return {}; }
}
exports.default = Dead;
},{"../../../AAEvents":106,"./PlayerState":138}],135:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("../../../../Wolfie2D/Input/Input"));
const AAControls_1 = require("../../../AAControls");
const PlayerController_1 = require("../PlayerController");
const PlayerState_1 = __importDefault(require("./PlayerState"));
class Fall extends PlayerState_1.default {
    onEnter(options) {
        // If we're falling, the vertical velocity should be >= 0
        // commenting this out bc it was preventing the fireball jumps from working
        if (this.parent.velocity.y > 0) {
            this.parent.velocity.y = 0;
        }
        if (!this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.JUMP_ATTACK)) {
            this.owner.animation.playIfNotAlready(PlayerController_1.PlayerAnimations.FALL);
        }
    }
    update(deltaT) {
        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            // this.parent.health -= Math.floor(this.parent.velocity.y / 300);
            this.parent.health -= 0; // remove fall damage
            if (Input_1.default.isPressed(AAControls_1.AAControls.MOVE_LEFT) || Input_1.default.isPressed(AAControls_1.AAControls.MOVE_RIGHT)) {
                this.parent.velocity.y = 0;
                this.finished(PlayerController_1.PlayerStates.RUN);
            }
            else {
                this.finished(PlayerController_1.PlayerStates.IDLE);
            }
        }
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;
            if (!this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.JUMP_ATTACK)) {
                this.owner.animation.playIfNotAlready(PlayerController_1.PlayerAnimations.FALL);
            }
            // Update the horizontal velocity of the player
            if (this.parent.isFirejumpActive) {
                this.parent.velocity.x += dir.x * this.parent.speed / 3.5 - 0.2 * this.parent.velocity.x;
            }
            else if (this.parent.isGrappleActive) {
                this.parent.velocity.x += dir.x * this.parent.speed / 3.5 - .1 * this.parent.velocity.x;
                if (Input_1.default.isPressed(AAControls_1.AAControls.MOVE_LEFT) || Input_1.default.isPressed(AAControls_1.AAControls.MOVE_RIGHT)) {
                    this.parent.isGrappleActive = false;
                }
            }
            else {
                this.parent.velocity.x += dir.x * this.parent.speed / 3.5 - 0.3 * this.parent.velocity.x;
            }
            // Update the vertical velocity of the player
            if (Input_1.default.isPressed(AAControls_1.AAControls.JUMP) && this.parent.velocity.y >= 0) {
                this.parent.velocity.y += this.gravity * deltaT * 0.20;
            }
            else {
                this.parent.velocity.y += this.gravity * deltaT;
            }
            if (this.owner.onCeiling && this.parent.velocity.y < 0)
                this.parent.velocity.y = Math.min(-this.parent.velocity.y, 20);
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
    }
    onExit() {
        this.parent.isFirejumpActive = false;
        this.parent.isGrappleActive = false;
        return {};
    }
}
exports.default = Fall;
},{"../../../../Wolfie2D/Input/Input":29,"../../../AAControls":105,"../PlayerController":133,"./PlayerState":138}],136:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerController_1 = require("../PlayerController");
const PlayerState_1 = __importDefault(require("./PlayerState"));
const Input_1 = __importDefault(require("../../../../Wolfie2D/Input/Input"));
const AAControls_1 = require("../../../AAControls");
const MathUtils_1 = __importDefault(require("../../../../Wolfie2D/Utils/MathUtils"));
class Idle extends PlayerState_1.default {
    onEnter(options) {
        this.owner.animation.play(PlayerController_1.PlayerAnimations.IDLE);
        this.parent.speed = this.parent.MIN_SPEED;
        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
    }
    update(deltaT) {
        // Adjust the direction the player is facing
        super.update(deltaT);
        // Get the direction of the player's movement
        let dir = this.parent.inputDir;
        if (!this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.ATTACK)) {
            this.owner.animation.playIfNotAlready(PlayerController_1.PlayerAnimations.IDLE);
        }
        // If the player is moving along the x-axis, transition to the walking state
        if (!dir.isZero() && dir.y === 0) {
            this.finished(PlayerController_1.PlayerStates.RUN);
        }
        // If the player is jumping, transition to the jumping state
        else if (Input_1.default.isJustPressed(AAControls_1.AAControls.JUMP)) {
            this.finished(PlayerController_1.PlayerStates.JUMP);
        }
        // If the player is not on the ground, transition to the falling state
        else if (!this.owner.onGround && this.parent.velocity.y > 0) {
            this.finished(PlayerController_1.PlayerStates.FALL);
        }
        else {
            // Update the vertical velocity of the player
            // If player stationary on ground, don't add to velocity, just set it
            // This check could probably be better but works for now
            if (this.parent.velocity.y === 0 || this.parent.velocity.y === this.gravity * deltaT) {
                this.parent.velocity.y = this.gravity * deltaT;
                // Otherwise if we have a velocity from a firejump (or something else), add to velocity
            }
            else {
                this.parent.velocity.y += this.gravity * deltaT;
            }
            if (this.parent.velocity.x > 0)
                this.parent.velocity.x = MathUtils_1.default.clampLow(this.parent.velocity.x - this.gravity * deltaT, 0);
            else
                this.parent.velocity.x = MathUtils_1.default.clampHigh(this.parent.velocity.x + this.gravity * deltaT, 0);
            if (this.owner.onCeiling && this.parent.velocity.y < 0)
                this.parent.velocity.y = Math.min(-this.parent.velocity.y, 20);
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
        // Otherwise, do nothing (keep idling)
    }
    onExit() {
        this.owner.animation.stop();
        return {};
    }
}
exports.default = Idle;
},{"../../../../Wolfie2D/Input/Input":29,"../../../../Wolfie2D/Utils/MathUtils":100,"../../../AAControls":105,"../PlayerController":133,"./PlayerState":138}],137:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameEventType_1 = require("../../../../Wolfie2D/Events/GameEventType");
const PlayerController_1 = require("../PlayerController");
const PlayerState_1 = __importDefault(require("./PlayerState"));
class Jump extends PlayerState_1.default {
    onEnter(options) {
        let scene = this.owner.getScene();
        // Give the player a burst of upward momentum
        this.parent.velocity.y = -200;
        // If the player is moving to the left or right, make them do a flip
        if (this.parent.velocity.x !== 0) {
            this.owner.animation.play(PlayerController_1.PlayerAnimations.JUMP);
        }
        // Play the jump sound for the player
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, { key: scene.getJumpAudioKey(), loop: false, holdReference: false });
    }
    update(deltaT) {
        // Update the direction the player is facing
        super.update(deltaT);
        // If the player hit the ground, start idling
        if (this.owner.onGround) {
            this.finished(PlayerController_1.PlayerStates.IDLE);
        }
        // If the player hit the ceiling or their velocity is >= to zero, 
        else if (this.owner.onCeiling || this.parent.velocity.y >= 0) {
            this.finished(PlayerController_1.PlayerStates.FALL);
        }
        // Otherwise move the player
        else {
            // Get the input direction from the player
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed / 3.5 - 0.3 * this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity * deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
    }
    onExit() {
        this.owner.animation.stop();
        return {};
    }
}
exports.default = Jump;
},{"../../../../Wolfie2D/Events/GameEventType":27,"../PlayerController":133,"./PlayerState":138}],138:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = __importDefault(require("../../../../Wolfie2D/DataTypes/State/State"));
const Input_1 = __importDefault(require("../../../../Wolfie2D/Input/Input"));
const MathUtils_1 = __importDefault(require("../../../../Wolfie2D/Utils/MathUtils"));
/**
 * An abstract state for the PlayerController
 */
class PlayerState extends State_1.default {
    constructor(parent, owner) {
        super(parent);
        this.owner = owner;
        this.gravity = 500;
    }
    /**
     * Handle game events from the parent.
     * @param event the game event
     */
    handleInput(event) {
        switch (event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
    }
    update(deltaT) {
        const direction = this.parent.inputDir;
        const mousePos = this.parent.faceDir;
        if (direction.x !== 0) {
            this.owner.invertX = MathUtils_1.default.sign(direction.x) < 0;
        }
        if (mousePos.x !== 0 && Input_1.default.isMouseJustPressed()) {
            this.owner.invertX = MathUtils_1.default.sign(mousePos.x) < 0;
        }
    }
}
exports.default = PlayerState;
},{"../../../../Wolfie2D/DataTypes/State/State":18,"../../../../Wolfie2D/Input/Input":29,"../../../../Wolfie2D/Utils/MathUtils":100}],139:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerController_1 = require("../PlayerController");
const Input_1 = __importDefault(require("../../../../Wolfie2D/Input/Input"));
const AAControls_1 = require("../../../AAControls");
const PlayerState_1 = __importDefault(require("./PlayerState"));
const MathUtils_1 = __importDefault(require("../../../../Wolfie2D/Utils/MathUtils"));
class Walk extends PlayerState_1.default {
    onEnter(options) {
        this.firstUpdate = true;
        this.parent.speed = this.parent.MIN_SPEED;
        if (!this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.ATTACK)) {
            this.owner.animation.playIfNotAlready(PlayerController_1.PlayerAnimations.WALK);
        }
    }
    update(deltaT) {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);
        // Get the input direction from the player controller
        let dir = this.parent.inputDir;
        // If the player is not moving - transition to the Idle state
        if (dir.isZero()) {
            this.finished(PlayerController_1.PlayerStates.IDLE);
        }
        // If the player hits the jump key - transition to the Jump state
        else if (Input_1.default.isJustPressed(AAControls_1.AAControls.JUMP)) {
            this.finished(PlayerController_1.PlayerStates.JUMP);
        }
        // If the player is not on the ground, transition to the fall state
        else if (!this.firstUpdate && !this.owner.onGround && this.parent.velocity.y !== 0) {
            this.finished(PlayerController_1.PlayerStates.FALL);
        }
        // Otherwise, move the player
        else {
            // Update the vertical velocity of the player
            // If player stationary on ground, don't add to velocity, just set it
            // This check could probably be better but works for now
            if (this.parent.velocity.y === 0 || this.parent.velocity.y === this.gravity * deltaT) {
                this.parent.velocity.y = this.gravity * deltaT;
                // Otherwise if we have a velocity from a firejump (or something else), add to velocity
            }
            else {
                this.parent.velocity.y += this.gravity * deltaT;
            }
            this.parent.velocity.x = dir.x * this.parent.speed;
            if (this.parent.velocity.x > 0)
                this.parent.velocity.x = MathUtils_1.default.clampLow(this.parent.velocity.x - this.gravity * deltaT, 0);
            else
                this.parent.velocity.x = MathUtils_1.default.clampHigh(this.parent.velocity.x + this.gravity * deltaT, 0);
            if (!this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.TAKING_DAMAGE) && !this.owner.animation.isPlaying(PlayerController_1.PlayerAnimations.ATTACK)) {
                this.owner.animation.playIfNotAlready(PlayerController_1.PlayerAnimations.WALK);
            }
            if (this.owner.onCeiling && this.parent.velocity.y < 0)
                this.parent.velocity.y = Math.min(-this.parent.velocity.y, 20);
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
        this.firstUpdate = false;
    }
    onExit() {
        this.owner.animation.stop();
        return {};
    }
}
exports.default = Walk;
},{"../../../../Wolfie2D/Input/Input":29,"../../../../Wolfie2D/Utils/MathUtils":100,"../../../AAControls":105,"../PlayerController":133,"./PlayerState":138}],140:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellTypes = void 0;
exports.SpellTypes = {
    TONGUE: "TONGUE",
    FIREBALL: "FIREBALL",
    ICE: "ICE"
};
},{}],141:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParticleSystem_1 = __importDefault(require("../../../Wolfie2D/Rendering/Animations/ParticleSystem"));
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const AAPhysicsGroups_1 = require("../../AAPhysicsGroups");
const Vec2_1 = __importDefault(require("../../../Wolfie2D/DataTypes/Vec2"));
const AAEvents_1 = require("../../AAEvents");
const Receiver_1 = __importDefault(require("../../../Wolfie2D/Events/Receiver"));
/**
 * The particle system used for the player's weapon
 */
class TongueParticle extends ParticleSystem_1.default {
    constructor() {
        super(...arguments);
        /**
         * The rotation (in radians) to apply to the velocity vector of the particles
         */
        this._rotation = 0;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
    }
    /**
     * @returns true if the particle system is running; false otherwise.
     */
    isSystemRunning() {
        return this.systemRunning;
    }
    /**
     *
     * @returns the particles in the pool of particles used in this particles system
     */
    getPool() {
        return this.particlePool;
    }
    /**
     * Sets the animations for a particle in the player's weapon
     * @param particle the particle to give the animation to
     */
    setParticleAnimation(particle) {
        // Give the particle a random velocity.
        //particle.vel = RandUtils.randVec(-32, 32, 100, 200);
        particle.vel = new Vec2_1.default(0, 252);
        // Rotate the particle's velocity vector
        particle.vel.rotateCCW(this._rotation);
        particle.color = Color_1.default.TRANSPARENT;
    }
    /**
     * Initializes this particle system in the given scene and layer
     *
     * All particles in the particle system should have their physics group set to
     * the HW4PhysicsGroup.PLAYER_WEAPON.
     *
     * @param scene the scene
     * @param layer the layer in the scene
     */
    initializePool(scene, layer) {
        super.initializePool(scene, layer);
        for (let i = 0; i < this.particlePool.length; i++) {
            // Set particle physics group to the player's weapon
            this.particlePool[i].setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE);
        }
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_CREATED);
    }
    update(deltaT) {
        super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.player && this.owner && this.isSystemRunning()) {
            const particle = this.particlePool[0];
            const newPos = this.owner.position
                .clone()
                .add(particle._velocity.normalized().scale(this.owner.size.y / 2));
            particle.position.copy(newPos);
        }
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.PLAYER_CREATED: {
                this.player = event.data.get("player");
                this.owner = event.data.get("tongue");
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in TongueParticle! Event type: ${event.type}`);
            }
        }
    }
    handlePlayerPosUpdate(vel) {
        if (this.particlePool.length > 0 && this.isSystemRunning()) {
            const particle = this.particlePool[0];
            if (!particle) {
                return;
            }
            const newPos = particle.position.clone().add(vel.normalized());
            particle.position.copy(newPos);
        }
    }
}
exports.default = TongueParticle;
},{"../../../Wolfie2D/DataTypes/Vec2":21,"../../../Wolfie2D/Events/Receiver":28,"../../../Wolfie2D/Rendering/Animations/ParticleSystem":65,"../../../Wolfie2D/Utils/Color":97,"../../AAEvents":106,"../../AAPhysicsGroups":107}],142:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Input_1 = __importDefault(require("../Wolfie2D/Input/Input"));
const AAControls_1 = require("./AAControls");
const Emitter_1 = __importDefault(require("../Wolfie2D/Events/Emitter"));
const AALevel3_1 = __importDefault(require("./Scenes/AALevel3"));
const AALevel4_1 = __importDefault(require("./Scenes/AALevel4"));
const AALevel5_1 = __importDefault(require("./Scenes/AALevel5"));
const AALevel6_1 = __importDefault(require("./Scenes/AALevel6"));
const AAEvents_1 = require("./AAEvents");
const GameEventType_1 = require("../Wolfie2D/Events/GameEventType");
const ParticleSystemManager_1 = __importDefault(require("../Wolfie2D/Rendering/Animations/ParticleSystemManager"));
const MainMenu_1 = __importDefault(require("./Scenes/MainMenu"));
const AALevel1_1 = __importDefault(require("./Scenes/AALevel1"));
const AALevel2_1 = __importDefault(require("./Scenes/AALevel2"));
const AALevel0_1 = __importDefault(require("./Scenes/AALevel0"));
class CheatsManager {
    constructor(sceneManager, options) {
        this.sceneManager = sceneManager;
        this.options = options;
        this.emitter = new Emitter_1.default();
    }
    update(deltaT) {
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_0)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 0;
            this.sceneManager.changeToScene(AALevel0_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_1)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 1;
            this.sceneManager.changeToScene(AALevel1_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_2)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 2;
            this.sceneManager.changeToScene(AALevel2_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_3)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 3;
            this.sceneManager.changeToScene(AALevel3_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_4)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 4;
            this.sceneManager.changeToScene(AALevel4_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_5)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 5;
            this.sceneManager.changeToScene(AALevel5_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_LEVEL_6)) {
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: this.options.levelMusicKey });
            MainMenu_1.default.CURRENT_LEVEL = 6;
            this.sceneManager.changeToScene(AALevel6_1.default);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.GOTO_BOSS)) {
            this.emitter.fireEvent(AAEvents_1.AAEvents.GOTO_BOSS);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.TOGGLE_INVINCIBILITY)) {
            this.emitter.fireEvent(AAEvents_1.AAEvents.TOGGLE_INVINCIBILITY);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.PLAYER_KILL)) {
            this.emitter.fireEvent(AAEvents_1.AAEvents.KILL_PLAYER);
        }
        if (Input_1.default.isJustPressed(AAControls_1.AAControls.UNLOCK_SPELLS)) {
            MainMenu_1.default.CURRENT_LEVEL = 6;
        }
    }
}
exports.default = CheatsManager;
},{"../Wolfie2D/Events/Emitter":24,"../Wolfie2D/Events/GameEventType":27,"../Wolfie2D/Input/Input":29,"../Wolfie2D/Rendering/Animations/ParticleSystemManager":66,"./AAControls":105,"./AAEvents":106,"./Scenes/AALevel0":151,"./Scenes/AALevel1":152,"./Scenes/AALevel2":153,"./Scenes/AALevel3":154,"./Scenes/AALevel4":155,"./Scenes/AALevel5":156,"./Scenes/AALevel6":157,"./Scenes/MainMenu":161}],143:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyStates = exports.EnemyTweens = exports.EnemyAnimations = void 0;
const StateMachineAI_1 = __importDefault(require("../../Wolfie2D/AI/StateMachineAI"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
// import Fall from "./EnemyStates/Fall";
// import Idle from "./EnemyStates/Idle"
// import Jump from "./EnemyStates/Jump";
// import Run from "./EnemyStates/Run";
// import Fireball from "./Fireball";
const Input_1 = __importDefault(require("../../Wolfie2D/Input/Input"));
const MathUtils_1 = __importDefault(require("../../Wolfie2D/Utils/MathUtils"));
const AAEvents_1 = require("../AAEvents");
// import Dead from "./EnemyStates/Dead";
const Receiver_1 = __importDefault(require("../../Wolfie2D/Events/Receiver"));
// import {SpellTypes} from "./SpellTypes";
/**
 * Animation keys for the Enemy spritesheet
 */
exports.EnemyAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    JUMP: "JUMP",
};
/**
 * Tween animations the Enemy can Enemy.
 */
exports.EnemyTweens = {
    FLIP: "FLIP",
    DEATH: "DEATH"
};
/**
 * Keys for the states the EnemyController can be in.
 */
exports.EnemyStates = {
    IDLE: "IDLE",
    RUN: "RUN",
    JUMP: "JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
};
/**
 * The controller that controls the Enemy.
 */
class EnemyController extends StateMachineAI_1.default {
    constructor() {
        super(...arguments);
        this.MAX_SPEED = 200;
        this.MIN_SPEED = 100;
    }
    initializeAI(owner, options) {
        this.owner = owner;
        //this.weapon = options.weaponSystem;
        // this.fireParticles = options.fireParticleSystem;
        // this.fireProjectile = options.fireballSystem;
        // this.iceParticles = options.iceParticleSystem;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap);
        this.speed = 400;
        this.velocity = Vec2_1.default.ZERO;
        this.health = 10;
        this.maxHealth = 10;
        // Add the different states the Enemy can be in to the EnemyController 
        // this.addState(EnemyStates.IDLE, new Idle(this, this.owner));
        // this.addState(EnemyStates.RUN, new Run(this, this.owner));
        // this.addState(EnemyStates.JUMP, new Jump(this, this.owner));
        // this.addState(EnemyStates.FALL, new Fall(this, this.owner));
        // this.addState(EnemyStates.DEAD, new Dead(this, this.owner));
        // Start the Enemy in the Idle state
        this.initialize(exports.EnemyStates.IDLE);
        this.receiver = new Receiver_1.default();
    }
    handleEvent(event) {
        switch (event.type) {
            // Move Enemy on a fireball jump
            // case HW3Events.Enemy_FIRE_JUMP: {
            //     const vel: Vec2 = event.data.get('fireJumpVel');
            //     const EnemyPos: Vec2 = event.data.get('EnemyPos');
            //     const particlePos: Vec2 = event.data.get('particlePos');
            //     // attempt to scale movement vector by difference in position
            //     const posDiff = MathUtils.clamp(EnemyPos.clone().distanceTo(particlePos), 1, 25);
            //     const scaleFactor = MathUtils.clamp(Math.pow(25, 0.8) - 0.7 * Math.pow(posDiff, 0.8), 0, 8);
            //     this.velocity = vel.clone().scale(scaleFactor);
            //     console.log('posDiff: ' + posDiff + ', scaleFactor: ' + scaleFactor);
            //     break;
            // }
            default: {
                throw new Error(`Unhandled event caught in Enemy controller with type ${event.type}`);
            }
        }
    }
    // /** 
    //  * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
    //  */
    // public get inputDir(): Vec2 {
    //     let direction = Vec2.ZERO;
    // 	direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
    // 	direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
    // 	return direction;
    // }
    /**
     * Gets the direction of the mouse from the Enemy's position as a Vec2
     */
    get faceDir() { return this.owner.position.dirTo(Input_1.default.getGlobalMousePosition()); }
    update(deltaT) {
        super.update(deltaT);
        // TODO not sure if should be before or after super call
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // Update the rotation to apply the particles velocity vector
        // Attack
        // Set the selected spell
    }
    get velocity() { return this._velocity; }
    set velocity(velocity) { this._velocity = velocity; }
    get speed() { return this._speed; }
    set speed(speed) { this._speed = speed; }
    get maxHealth() { return this._maxHealth; }
    set maxHealth(maxHealth) { this._maxHealth = maxHealth; }
    get health() { return this._health; }
    set health(health) {
        this._health = MathUtils_1.default.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(AAEvents_1.AAEvents.HEALTH_CHANGE, { curhp: this.health, maxhp: this.maxHealth });
        // If the health hit 0, change the state of the Enemy
        if (this.health === 0) {
            this.changeState(exports.EnemyStates.DEAD);
        }
    }
}
exports.default = EnemyController;
},{"../../Wolfie2D/AI/StateMachineAI":2,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/Receiver":28,"../../Wolfie2D/Input/Input":29,"../../Wolfie2D/Utils/MathUtils":100,"../AAEvents":106}],144:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasNodeFactory_1 = __importDefault(require("../../Wolfie2D/Scene/Factories/CanvasNodeFactory"));
const AAAnimatedSprite_1 = __importDefault(require("../Nodes/AAAnimatedSprite"));
/**
 * An extension of Wolfie2ds CanvasNodeFactory. The purpose of the class is to add functionality for adding custom
 * game nodes to HW3Levels.
 */
class AACanvasNodeFactory extends CanvasNodeFactory_1.default {
    constructor() {
        super(...arguments);
        // Overriden to return HW3AnimatedSprites instead of regular AnimatedSprites
        this.addAnimatedSprite = (key, layerName) => {
            let layer = this.scene.getLayer(layerName);
            let spritesheet = this.resourceManager.getSpritesheet(key);
            let instance = new AAAnimatedSprite_1.default(spritesheet);
            // Add instance fo scene
            instance.setScene(this.scene);
            instance.id = this.scene.generateId();
            if (!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))) {
                this.scene.getSceneGraph().addNode(instance);
            }
            // Add instance to layer
            layer.addNode(instance);
            return instance;
        };
    }
    // Overriden to only accept HW4Levels
    init(scene) { super.init(scene); }
}
exports.default = AACanvasNodeFactory;
},{"../../Wolfie2D/Scene/Factories/CanvasNodeFactory":85,"../Nodes/AAAnimatedSprite":147}],145:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FactoryManager_1 = __importDefault(require("../../Wolfie2D/Scene/Factories/FactoryManager"));
const AACanvasNodeFactory_1 = __importDefault(require("./AACanvasNodeFactory"));
/**
 * An extension of Wolfie2ds FactoryManager. I'm creating a more specific factory for my custom HW3Level. If you want to get custom
 * GameNodes into your scenes (with more specific properties) you'll have to extend the factory classes.
 */
class AAFactoryManager extends FactoryManager_1.default {
    constructor(scene, tilemaps) {
        super(scene, tilemaps);
        this.aaCanvasNodeFactory = new AACanvasNodeFactory_1.default();
        this.aaCanvasNodeFactory.init(scene);
    }
    animatedSprite(key, layerName) {
        return this.aaCanvasNodeFactory.addAnimatedSprite(key, layerName);
    }
    uiElement(type, layerName, options) {
        return super.uiElement(type, layerName, options);
    }
    graphic(type, layerName, options) {
        return super.graphic(type, layerName, options);
    }
    sprite(key, layerName) {
        return super.sprite(key, layerName);
    }
}
exports.default = AAFactoryManager;
},{"../../Wolfie2D/Scene/Factories/FactoryManager":86,"./AACanvasNodeFactory":144}],146:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __importDefault(require("../../../Wolfie2D/Utils/Color"));
const UIElementTypes_1 = require("../../../Wolfie2D/Nodes/UIElements/UIElementTypes");
/**
 * A UI component that's suppossed to represent a healthbar
 */
class HealthbarHUD {
    constructor(scene, owner, layer, options) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;
        this.size = options.size;
        this.offset = options.offset;
        this.healthBar = this.scene.add.uiElement(UIElementTypes_1.UIElementType.LABEL, layer, {
            position: this.owner.position.clone().add(this.offset),
            text: "",
        });
        this.healthBar.size.copy(this.size);
        this.healthBar.backgroundColor = Color_1.default.RED;
        this.healthBarBg = this.scene.add.uiElement(UIElementTypes_1.UIElementType.LABEL, layer, {
            position: this.owner.position.clone().add(this.offset),
            text: "",
        });
        this.healthBarBg.backgroundColor = Color_1.default.TRANSPARENT;
        this.healthBarBg.borderColor = Color_1.default.BLACK;
        this.healthBarBg.borderWidth = 1;
        this.healthBarBg.size.copy(this.size);
    }
    /**
     * Updates the healthbars position according to the position of it's owner
     * @param deltaT
     */
    update(deltaT) {
        this.healthBar.position.copy(this.owner.position).add(this.offset);
        this.healthBarBg.position.copy(this.owner.position).add(this.offset);
        let scale = this.scene.getViewScale();
        this.healthBar.scale.scale(scale);
        this.healthBarBg.scale.scale(scale);
        let unit = this.healthBarBg.size.x / this.owner.maxHealth;
        this.healthBar.size.set(this.healthBarBg.size.x - unit * (this.owner.maxHealth - this.owner.health), this.healthBarBg.size.y);
        this.healthBar.position.set(this.healthBarBg.position.x -
            (unit / scale / 2) * (this.owner.maxHealth - this.owner.health), this.healthBarBg.position.y);
        this.healthBar.backgroundColor =
            this.owner.health < (this.owner.maxHealth * 1) / 4
                ? Color_1.default.RED
                : this.owner.health < (this.owner.maxHealth * 3) / 4
                    ? Color_1.default.YELLOW
                    : Color_1.default.GREEN;
    }
    get ownerId() {
        return this.owner.id;
    }
    set visible(visible) {
        this.healthBar.visible = visible;
        this.healthBarBg.visible = visible;
    }
    set static(isStatic) {
        this.isStatic = isStatic;
    }
}
exports.default = HealthbarHUD;
},{"../../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../../Wolfie2D/Utils/Color":97}],147:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnimatedSprite_1 = __importDefault(require("../../Wolfie2D/Nodes/Sprites/AnimatedSprite"));
const MathUtils_1 = __importDefault(require("../../Wolfie2D/Utils/MathUtils"));
/**
 * An animated sprite in the HW3Level. I have extended the animated sprite to create a more specific sprite
 * with a reference to a HW3Level. One of the things I want to try and show all of you is how to extend
 * Wolfie2d.
 *
 * For the HW3AnimatedSprite, I've just overriden the type of the scene and the associated getter/setter
 * methods. Without this, you would have to explicitly cast the type of the scene to a HW3Level to get access
 * to the methods associated with HW3Level.
 *
 * - Peter
 */
class AAAnimatedSprite extends AnimatedSprite_1.default {
    setScene(scene) { this.scene = scene; }
    getScene() { return this.scene; }
    get maxHealth() { return this.max_health; }
    set maxHealth(health) { this.max_health = health; }
    get health() { return this._health; }
    set health(health) {
        this._health = MathUtils_1.default.clamp(health, 0, this.maxHealth);
        // this.emitter.fireEvent(AAEvents.ENEMY_HEALTH_CHANGE, {id: this.id, curhp: this.health, maxhp: this.maxHealth});
        if (this._health === 0) {
            this.tweens.play("DEATH");
            // this.emitter.fireEvent(AAEvents.NPC_KILLED, {node: this.id});
        }
    }
}
exports.default = AAAnimatedSprite;
},{"../../Wolfie2D/Nodes/Sprites/AnimatedSprite":44,"../../Wolfie2D/Utils/MathUtils":100}],148:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const Receiver_1 = __importDefault(require("../../Wolfie2D/Events/Receiver"));
const AAEvents_1 = require("../AAEvents");
var IceState;
(function (IceState) {
    IceState[IceState["EXTENDING"] = 0] = "EXTENDING";
    IceState[IceState["RETRACTING"] = 1] = "RETRACTING";
})(IceState || (IceState = {}));
class IceBehavior {
    initializeAI(owner, options) {
        this.owner = owner;
        this.src = Vec2_1.default.ZERO;
        this.receiver = new Receiver_1.default();
        this.activate(options);
    }
    destroy() {
    }
    activate(options) {
        //this.receiver.ignoreEvents();
        this.src.copy(options.src);
        // Set the size of the Ice
        this.owner.size = new Vec2_1.default(20, 10);
        this.owner.position.copy(this.src);
        // this.owner.addPhysics()
        // this.owner.setGroup(HW3PhysicsGroups.Ice)
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.CREATE_PLATFORM: {
                this.handleCreatePlatform();
                break;
            }
            default: {
                throw new Error("Unhandled event caught in IceBehavior! Event type: " + event.type);
            }
        }
    }
    handleCreatePlatform() {
    }
    // private resetState(): void {
    //     this.state = IceState.EXTENDING;
    //     this.distanceTraveled = 0;
    //     this.IceActive = true;
    //     this.stopExtending = false;
    // }
    update(deltaT) {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        // Only update the Ice if it's visible and the flag is not set to stop extending
        if (this.owner.visible) {
        }
    }
}
exports.default = IceBehavior;
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/Receiver":28,"../AAEvents":106}],149:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const Receiver_1 = __importDefault(require("../../Wolfie2D/Events/Receiver"));
const AAEvents_1 = require("../AAEvents");
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const Emitter_1 = __importDefault(require("../../Wolfie2D/Events/Emitter"));
var TongueState;
(function (TongueState) {
    TongueState[TongueState["EXTENDING"] = 0] = "EXTENDING";
    TongueState[TongueState["RETRACTING"] = 1] = "RETRACTING";
})(TongueState || (TongueState = {}));
class TongueBehavior {
    initializeAI(owner, options) {
        this.owner = owner;
        // this.player = options.player;
        this.src = Vec2_1.default.ZERO;
        this.dir = Vec2_1.default.ZERO;
        this.currentXSpeed = 50;
        this.xSpeedIncrement = 0;
        this.minXSpeed = 50;
        this.maxXSpeed = 50;
        this.currentYSpeed = 250;
        this.ySpeedIncrement = 0;
        this.minYSpeed = 50;
        this.maxYSpeed = 50;
        this.receiver = new Receiver_1.default();
        this.receiver.subscribe(AAEvents_1.AAEvents.ENEMY_ATTACHED);
        this.receiver.subscribe(AAEvents_1.AAEvents.TONGUE_WALL_COLLISION);
        this.receiver.subscribe(AAEvents_1.AAEvents.SHOOT_TONGUE);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_CREATED);
        this.emitter = new Emitter_1.default();
        this.state = TongueState.EXTENDING;
        this.maxDistance = 123; // Set the maximum distance the tongue can extend
        this.distanceTraveled = 0;
        this.tongueActive = false;
        this.playerPos = Vec2_1.default.ZERO;
        this.stopExtending = false;
        this.attachedEnemy = null;
        this.frozenOverlay = null;
        this.wallCollision = false;
        this.activate(options);
    }
    destroy() { }
    activate(options) {
        //this.receiver.ignoreEvents();
        this.src.copy(options.src);
        this.dir.copy(options.dir);
        // Set the size of the tongue
        this.owner.size = new Vec2_1.default(3, 1);
        // Set the position of the tongue
        const tongueBase = this.src
            .clone()
            .add(this.dir.normalized().scale(this.owner.size.y * 0.5));
        this.owner.position.copy(tongueBase);
        this.owner.rotation = Vec2_1.default.RIGHT.angleToCCW(this.dir) - Math.PI / 2;
        this.owner.boundary.sweep(new Vec2_1.default(5, 5), this.src, this.dir);
        this.owner.addPhysics();
        this.owner.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE);
        //this.tongueTipAABB = new AABB(this.owner.position.clone().add(this.dir.normalized().scale(this.owner.size.y/2)), new Vec2(this.owner.size.x/2, this.owner.size.y/2));
        // Set the collision shape of the tongue - these values are probably wrong
        // TODO Make AABB just the tip of the tongue so rotation doesn't matter?
    }
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.TONGUE_WALL_COLLISION: {
                this.wallCollision = true;
                this.handleTongueWallCollision();
                break;
            }
            case AAEvents_1.AAEvents.ENEMY_ATTACHED: {
                const enemy = event.data.get("enemy");
                if (enemy && enemy.health / enemy.maxHealth <= 1 / 3) {
                    this.attachedEnemy = enemy;
                    this.frozenOverlay = event.data.get("overlay");
                }
                else {
                    enemy.health -= 0.5;
                }
                this.stopExtending = true;
                break;
            }
            case AAEvents_1.AAEvents.SHOOT_TONGUE: {
                if (!this.tongueActive) {
                    this.resetState();
                }
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_CREATED: {
                this.player = event.data.get("player");
                break;
            }
            default: {
                throw new Error("Unhandled event caught in TongueBehavior! Event type: " + event.type);
            }
        }
    }
    handleTongueWallCollision() {
        // TODO might not need to do anything with ID's since we only have one tongue
        // but just copying hw2 for now to try to get something rendered first
        // this.owner.position.copy(Vec2.ZERO);
        // this.owner.visible = false;
        this.stopExtending = true;
    }
    handlePlayerPosUpdate(pos) {
        // Calculate the position of the tongue base
        const tongueBase = pos.clone().add(this.dir.normalized().scale(this.owner.size.y * 0.5));
        this.playerPos = pos.clone();
        this.owner.position.copy(tongueBase);
    }
    getTongueTipAABB() {
        return this.tongueTipAABB;
    }
    resetState() {
        this.state = TongueState.EXTENDING;
        this.distanceTraveled = 0;
        this.tongueActive = true;
        this.stopExtending = false;
        this.attachedEnemy = null;
        this.frozenOverlay = null;
        this.wallCollision = false;
    }
    update(deltaT) {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (!this.player) {
            return;
        }
        const tongueBase = this.player.position
            .clone()
            .add(this.dir.normalized().scale(this.owner.size.y * 0.5));
        this.playerPos = this.player.position.clone();
        this.owner.position.copy(tongueBase);
        // Check if there's an attached enemy
        if (this.attachedEnemy && !this.wallCollision) {
            const tongueMovement = this.dir.normalized().scale(-this.currentYSpeed * deltaT);
            this.attachedEnemy.freeze();
            // Calculate the vector from the enemy to the player
            const direction = this.playerPos.clone().sub(this.attachedEnemy.position);
            // Calculate the distance that the enemy moves per frame in the X and Y directions
            const movementX = direction.normalized().x * tongueMovement.mag();
            const movementY = direction.normalized().y * tongueMovement.mag();
            const scaleDelta = 0.01;
            // Move the enemy towards the player
            this.attachedEnemy.position.add(new Vec2_1.default(movementX, movementY));
            if (this.frozenOverlay) {
                this.frozenOverlay.position.add(new Vec2_1.default(movementX, movementY));
                this.frozenOverlay.scale.sub(new Vec2_1.default(1, 1));
            }
            // Decrease the enemy's scale each frame
            this.attachedEnemy.scale.sub(new Vec2_1.default(scaleDelta, scaleDelta));
        }
        // Only update the tongue if it's visible and the flag is not set to stop extending
        if (this.owner.visible) {
            // TODO need to set up collision somewhere for this
            let movement;
            if (this.stopExtending) {
                this.state = TongueState.RETRACTING;
            }
            if (this.state === TongueState.EXTENDING) {
                movement = this.dir.normalized().scale(this.currentYSpeed * deltaT);
                this.distanceTraveled += movement.mag();
                // Increase the height of the tongue
                this.owner.size.y += movement.mag();
                if (this.distanceTraveled >= this.maxDistance) {
                    this.state = TongueState.RETRACTING;
                }
            }
            else if (this.state === TongueState.RETRACTING) {
                movement = this.dir.normalized().scale(-this.currentYSpeed * deltaT);
                this.distanceTraveled -= movement.mag();
                // Decrease the height of the tongue
                this.owner.size.y -= movement.mag();
                if (this.distanceTraveled <= 0) {
                    // Hide the tongue and stop updating when fully retracted
                    this.owner.visible = false;
                    this.distanceTraveled = 0;
                    this.tongueActive = false;
                    this.stopExtending = false;
                    if (this.attachedEnemy) {
                        if (this.frozenOverlay) {
                            this.frozenOverlay.destroy();
                        }
                        this.emitter.fireEvent(AAEvents_1.AAEvents.NPC_KILLED, {
                            node: this.attachedEnemy.id,
                        });
                        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_HEAL);
                    }
                    this.attachedEnemy = null;
                    this.frozenOverlay = null;
                    return;
                }
            }
            // const tongueBase = this.player.position
            //     .clone()
            //     .add(this.dir.normalized().scale(this.owner.size.y * 0.5));
            // this.playerPos = this.player.position.clone();
            // this.owner.position.copy(tongueBase);
            this.owner.position.add(movement);
        }
    }
}
exports.default = TongueBehavior;
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/Emitter":24,"../../Wolfie2D/Events/Receiver":28,"../AAEvents":106,"../AAPhysicsGroups":107}],150:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AALayers = void 0;
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../Wolfie2D/Events/GameEventType");
const Input_1 = __importDefault(require("../../Wolfie2D/Input/Input"));
const GameNode_1 = require("../../Wolfie2D/Nodes/GameNode");
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Timer_1 = __importDefault(require("../../Wolfie2D/Timing/Timer"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const PlayerController_1 = __importStar(require("../AI/Player/PlayerController"));
const Fireball_1 = __importDefault(require("../AI/Player/Fireball"));
const FireParticles_1 = __importDefault(require("../AI/Player/FireParticles"));
const AAEvents_1 = require("../AAEvents");
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAFactoryManager_1 = __importDefault(require("../Factory/AAFactoryManager"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
const TongueBehavior_1 = __importDefault(require("../Nodes/TongueBehavior"));
const TongueShaderType_1 = __importDefault(require("../Shaders/TongueShaderType"));
const SpellTypes_1 = require("../AI/Player/SpellTypes");
const IceParticles_1 = __importDefault(require("../AI/Player/IceParticles"));
const TongueParticle_1 = __importDefault(require("../AI/Player/TongueParticle"));
const IceBehavior_1 = __importDefault(require("../Nodes/IceBehavior"));
const ParticleSystemManager_1 = __importDefault(require("../../Wolfie2D/Rendering/Animations/ParticleSystemManager"));
/**
 * A const object for the layer names
 */
exports.AALayers = {
    GUIDE: "GUIDE",
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI",
    // The PAUSE layer
    PAUSE: "PAUSE",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    TONGUE: "TONGUE",
    BACKGROUND: "BACKGROUND",
};
/**
 * An abstract HW4 scene class.
 */
class AALevel extends Scene_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, Object.assign(Object.assign({}, options), { physics: {
                groupNames: [
                    AAPhysicsGroups_1.AAPhysicsGroups.GROUND,
                    AAPhysicsGroups_1.AAPhysicsGroups.PLAYER,
                    AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL,
                    AAPhysicsGroups_1.AAPhysicsGroups.FIRE_PARTICLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.DESTRUCTABLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.TONGUE_COLLIDABLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.TONGUE,
                    AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.ENEMY,
                    AAPhysicsGroups_1.AAPhysicsGroups.ICE_PLATFORM,
                    AAPhysicsGroups_1.AAPhysicsGroups.BOSS_PARTICLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL,
                    AAPhysicsGroups_1.AAPhysicsGroups.ANT_PARTICLE,
                    AAPhysicsGroups_1.AAPhysicsGroups.ENEMY_PARTICLE,
                ],
                collisions: [
                    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
                    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
                    [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                ],
            } }));
        this.ignoredAnimations = [
            "ATTACKING",
            "ATTACKING_LEFT",
            "ATTACKING_RIGHT",
            "CASTING_LEFT",
            "TAKING_DAMAGE",
            "TAKING_DAMAGE_LEFT",
            "TAKING_DAMAGE_RIGHT",
        ];
        this.add = new AAFactoryManager_1.default(this, this.tilemaps);
        this.tongueSelectPos = new Vec2_1.default(13.3, 25.5);
        this.fireballSelectPos = new Vec2_1.default(24.3, 25.5);
        this.iceSelectPos = new Vec2_1.default(35.3, 25.5);
        this.selectedSpell = SpellTypes_1.SpellTypes.TONGUE;
        // this.selectedSpell = SpellTypes.FIREBALL;
        this.allNPCS = new Map();
        this.healthbars = new Map();
        this.freezeOverlays = new Map();
        this.bossDead = false;
    }
    loadScene() {
        this.load.shader(TongueShaderType_1.default.KEY, TongueShaderType_1.default.VSHADER, TongueShaderType_1.default.FSHADER);
    }
    startScene() {
        // Initialize the layers
        this.initLayers();
        // Initialize the tilemaps
        this.initializeTilemap();
        // Initialize the sprite and particle system for the players weapon
        this.initializeWeaponSystem();
        // Initialize the player
        this.initializePlayer(this.playerSpriteKey);
        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        this.initializeUI();
        this.initializePause();
        this.getLayer(exports.AALayers.PAUSE).disable();
        this.initializeControls();
        this.getLayer(exports.AALayers.CONTROLS).disable();
        this.initializeHelp();
        this.getLayer(exports.AALayers.HELP).disable();
        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        this.initializeLevelEnds();
        this.levelTransitionTimer = new Timer_1.default(500);
        this.levelEndTimer = new Timer_1.default(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });
        // Init timers
        this.fireballTimer = new Timer_1.default(300);
        this.bossIFrameTimer = new Timer_1.default(1000);
        this.guideTextTimer = new Timer_1.default(30000, () => {
            this.guideText.backgroundColor.a = 0;
            this.guideText.textColor.a = 0;
            this.textLoopTimer.reset();
        });
        this.deathTimer = new Timer_1.default(3000, () => {
            this.sceneManager.changeToScene(this.currLevel);
            Input_1.default.enableInput();
        });
        // Initially disable player movement
        Input_1.default.disableInput();
        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");
        // Start playing the level music for the HW4 level
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.levelMusicKey,
            loop: true,
            holdReference: true,
        });
        this.bossFightActive = false;
        // Initialize the background
        if (this.backgroundKey) {
            this.initBackground();
        }
    }
    /* Update method for the scene */
    updateScene(deltaT) {
        // console.log(this.player.position.x + " " + this.player.position.y);
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        if (this.backgroundKey) {
            this.moveBackground(deltaT);
        }
        if (this.selectedSpell === SpellTypes_1.SpellTypes.ICE &&
            this.iceParticleSystem.getPool()[0].visible &&
            Input_1.default.isMouseJustPressed()) {
            const iceParticle = this.iceParticleSystem.getPool()[0];
            this.emitter.fireEvent(AAEvents_1.AAEvents.CREATE_PLATFORM, {
                pos: iceParticle.position,
            });
        }
        // update if cheats unlock spells
        if (MainMenu_1.default.CURRENT_LEVEL >= 0 && this.fireIcon.imageId != "tongueIcon") {
            this.tongueIcon.setImageId("tongueIcon");
        }
        if (MainMenu_1.default.CURRENT_LEVEL >= 3 && this.fireIcon.imageId != "fireIcon") {
            this.fireIcon.setImageId("fireIcon");
        }
        if (MainMenu_1.default.CURRENT_LEVEL >= 5 && this.iceIcon.imageId != "iceIcon") {
            this.iceIcon.setImageId("iceIcon");
        }
        this.healthbars.forEach((healthbar) => healthbar.update(deltaT));
        // Player position code to determine monster spawn positions
        // console.log(this.player.position.x, this.player.position.y);
        // Lock player to viewport in boss fights
        if (this.bossFightActive) {
            this.lockPlayer(this.player, this.viewport.getCenter(), this.viewport.getHalfSize());
        }
    }
    lockPlayer(player, viewportCenter, viewportHalfSize) {
        const playerLeftEdge = player.position.x - player.size.x / 4;
        const playerRightEdge = player.position.x + player.size.x / 4;
        const viewportLeftEdge = viewportCenter.x - viewportHalfSize.x;
        const viewportRightEdge = viewportCenter.x + viewportHalfSize.x;
        if (playerLeftEdge <= viewportLeftEdge) {
            player.position.x = viewportLeftEdge + player.size.x / 4;
        }
        else if (playerRightEdge >= viewportRightEdge) {
            player.position.x = viewportRightEdge - player.size.x / 4;
        }
    }
    /**
     * Handle game events.
     * @param event the game event
     */
    handleEvent(event) {
        switch (event.type) {
            case AAEvents_1.AAEvents.PAUSE: {
                this.handlePauseGame();
                break;
            }
            case AAEvents_1.AAEvents.RESUME: {
                this.handleResumeGame();
                break;
            }
            case AAEvents_1.AAEvents.CONTROLS: {
                this.handleShowControls();
                break;
            }
            case AAEvents_1.AAEvents.HELP: {
                this.handleShowHelp();
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case AAEvents_1.AAEvents.LEVEL_START: {
                Input_1.default.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case AAEvents_1.AAEvents.LEVEL_END: {
                ParticleSystemManager_1.default.getInstance().clearParticleSystems();
                this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, {
                    key: this.levelMusicKey,
                });
                if (MainMenu_1.default.LEVEL_COUNTER < this.nextLevelNum) {
                    MainMenu_1.default.LEVEL_COUNTER = this.nextLevelNum;
                }
                MainMenu_1.default.CURRENT_LEVEL = this.nextLevelNum;
                if (MainMenu_1.default.CURRENT_LEVEL >= 6) {
                    this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_MUSIC, {
                        key: MainMenu_1.default.MUSIC_KEY,
                        loop: true,
                        holdReference: true,
                    });
                }
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
            case AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY: {
                if (this.fireballTimer.isStopped()) {
                    this.fireballTimer.start();
                    const enemy = this.allNPCS.get(event.data.get("other"));
                    enemy.health -= 1;
                    if (enemy.frozen && this.freezeOverlays.get(enemy.id)) {
                        enemy.unfreeze();
                        enemy.animation.resume();
                        enemy.health -= 3;
                        this.freezeOverlays.get(enemy.id).visible = false;
                        this.freezeOverlays.delete(enemy.id);
                    }
                    if (this.bossFightActive) {
                        this.handleHealthChange(this.bossHealthBar, this.bossHealthBarBg, enemy.health, enemy.maxHealth);
                    }
                    let current = enemy.animation.currentAnimation;
                    const prev = enemy.animation.getPending();
                    enemy.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        enemy.animation.queue(current, true);
                    }
                    else {
                        enemy.animation.queue(prev, true);
                    }
                    this.handleFireballHit();
                }
                break;
            }
            case AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY: {
                const enemy = this.allNPCS.get(event.data.get("other"));
                if (!enemy.frozen) {
                    enemy.freeze();
                    enemy.animation.pause();
                    // Add a cyan overlay to indicate that the enemy is frozen
                    const frozenOverlay = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.PRIMARY, {
                        position: Vec2_1.default.ZERO,
                        size: Vec2_1.default.ZERO,
                    });
                    frozenOverlay.color = Color_1.default.CYAN; // Cyan color
                    frozenOverlay.alpha = 0.5; // Set transparency
                    frozenOverlay.size = enemy.size.clone().scale(0.35, 0.25);
                    frozenOverlay.position = enemy.position.clone();
                    frozenOverlay.visible = true;
                    this.freezeOverlays.set(enemy.id, frozenOverlay);
                    this.iceParticleSystem.getPool()[0].freeze();
                    this.iceParticleSystem.getPool()[0].visible = false;
                    //how long the enmy is frozen for
                    this.frozenTimer = new Timer_1.default(3000, () => {
                        enemy.unfreeze();
                        enemy.animation.resume();
                        frozenOverlay.visible = false;
                        this.freezeOverlays.delete(enemy.id);
                    });
                    this.frozenTimer.start();
                }
                break;
            }
            case AAEvents_1.AAEvents.ICE_HIT_BOSS: {
                if (this.bossIFrameTimer.isStopped()) {
                    const boss = this.allNPCS.get(event.data.get("other"));
                    boss.health -= 1;
                    this.handleHealthChange(this.bossHealthBar, this.bossHealthBarBg, boss.health, boss.maxHealth);
                    let current = boss.animation.currentAnimation;
                    const prev = boss.animation.getPending();
                    boss.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        boss.animation.queue(current, true);
                    }
                    else {
                        boss.animation.queue(prev, true);
                    }
                    this.bossIFrameTimer.start();
                }
                break;
            }
            case AAEvents_1.AAEvents.TONGUE_HIT_BOSS: {
                if (this.bossIFrameTimer.isStopped()) {
                    const boss = this.allNPCS.get(event.data.get("other"));
                    boss.health -= 1;
                    this.handleHealthChange(this.bossHealthBar, this.bossHealthBarBg, boss.health, boss.maxHealth);
                    let current = boss.animation.currentAnimation;
                    const prev = boss.animation.getPending();
                    boss.animation.playIfNotAlready("TAKING_DAMAGE");
                    if (!this.ignoredAnimations.includes(current)) {
                        boss.animation.queue(current, true);
                    }
                    else {
                        boss.animation.queue(prev, true);
                    }
                    this.bossIFrameTimer.start();
                }
                break;
            }
            case AAEvents_1.AAEvents.TONGUE_HIT_ENEMY: {
                const enemy = this.allNPCS.get(event.data.get("other"));
                this.tongueParticleSystem.getPool()[0].freeze();
                this.tongueParticleSystem.getPool()[0].visible = false;
                const overlay = this.freezeOverlays.get(enemy.id);
                //I hope there's another way
                this.emitter.fireEvent(AAEvents_1.AAEvents.ENEMY_ATTACHED, {
                    enemy: enemy,
                    overlay: overlay,
                });
                let current = enemy.animation.currentAnimation;
                const prev = enemy.animation.getPending();
                enemy.animation.play("TAKING_DAMAGE");
                if (!this.ignoredAnimations.includes(current) && !enemy.frozen) {
                    enemy.animation.queue(current, true);
                }
                else {
                    enemy.animation.queue(prev, true);
                }
                break;
            }
            case AAEvents_1.AAEvents.PARTICLE_HIT_DESTRUCTIBLE: {
                if (this.fireballTimer.isStopped()) {
                    this.fireballTimer.start();
                    this.handleFireballHit();
                }
                break;
            }
            case AAEvents_1.AAEvents.ANT_FIRE_HIT: {
                this.handleAntFireballHit();
                if (event.data.get("other") === this.player.id) {
                    this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_HIT);
                }
                break;
            }
            case AAEvents_1.AAEvents.ICE_COLLISION: {
                this.iceParticleSystem.getPool()[0].freeze();
                this.iceParticleSystem.getPool()[0].visible = false;
                break;
            }
            case AAEvents_1.AAEvents.HEALTH_CHANGE: {
                this.handleHealthChange(this.healthBar, this.healthBarBg, event.data.get("curhp"), event.data.get("maxhp"));
                break;
            }
            case AAEvents_1.AAEvents.PLAYER_DEAD: {
                // MainMenu.GAME_PLAYING = false;
                ParticleSystemManager_1.default.getInstance().clearParticleSystems();
                Input_1.default.disableInput();
                if (this.deathTimer.isStopped() && !this.deathTimer.hasRun()) {
                    this.player.animation.play(PlayerController_1.PlayerAnimations.DYING);
                    this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                        key: this.playerDeathAudioKey,
                        loop: false,
                        holdReference: false,
                    });
                    this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, {
                        key: this.levelMusicKey,
                    });
                    this.deathTimer.start();
                }
                // this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: this.levelMusicKey, loop: true, holdReference: true});
                // this.sceneManager.changeToScene(MainMenu);
                // this.iceParticleSystem.stopSystem();
                // this.fireParticleSystem.stopSystem();
                // this.tongueParticleSystem.stopSystem();
                // this.sceneManager.changeToScene(this.currLevel);
                // this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case "NPC_BOSS_KILLED": {
                const id = event.data.get("node");
                const enemy = this.allNPCS.get(id);
                if (enemy) {
                    enemy.destroy();
                    const healthbar = this.healthbars.get(id);
                    if (healthbar) {
                        healthbar.visible = false;
                    }
                    const freeze = this.freezeOverlays.get(id);
                    if (freeze) {
                        freeze.visible = false;
                    }
                }
                this.emitter.fireEvent(AAEvents_1.AAEvents.BOSS_KILLED);
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.enemyDeathAudioKey,
                    loop: false,
                    holdReference: false,
                });
                break;
                break;
            }
            case AAEvents_1.AAEvents.NPC_KILLED: {
                const id = event.data.get("node");
                const enemy = this.allNPCS.get(id);
                if (enemy) {
                    enemy.destroy();
                    const healthbar = this.healthbars.get(id);
                    if (healthbar) {
                        healthbar.visible = false;
                    }
                    const freeze = this.freezeOverlays.get(id);
                    if (freeze) {
                        freeze.visible = false;
                    }
                }
                if (this.bossFightActive) {
                    this.emitter.fireEvent(AAEvents_1.AAEvents.BOSS_KILLED);
                }
                this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
                    key: this.enemyDeathAudioKey,
                    loop: false,
                    holdReference: false,
                });
                break;
            }
            case AAEvents_1.AAEvents.SHOOT_TONGUE: {
                const pos = event.data.get("pos");
                const dir = event.data.get("dir");
                this.spawnTongue(pos, dir);
                break;
            }
            case AAEvents_1.AAEvents.CREATE_PLATFORM: {
                // console.log(this.tilemap.getColRowAt(Input.getGlobalMousePosition()))
                // this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(event.data.get('pos')),5);
                this.spawnIceBlock(event.data.get("pos"));
                break;
            }
            // Handle spell switching
            case AAEvents_1.AAEvents.SELECT_TONGUE: {
                // TODO temp because tongue is broken
                this.handleSelectTongue();
                // this.handleSelectFireball();
                break;
            }
            case AAEvents_1.AAEvents.SELECT_FIREBALL: {
                // TODO temp because tongue is broken
                this.handleSelectFireball();
                // this.handleSelectIce();
                break;
            }
            case AAEvents_1.AAEvents.SELECT_ICE: {
                // TODO temp because tongue is broken
                this.handleSelectIce();
                // this.handleSelectTongue();
                break;
            }
            case AAEvents_1.AAEvents.TONGUE_WALL_COLLISION: {
                this.handleTongueHit();
                break;
            }
            case AAEvents_1.AAEvents.GOTO_BOSS: {
                if (!this.bossFightActive && this.bossSpawnTrigger != null) {
                    this.player.position = this.bossSpawnTrigger.position;
                }
                break;
            }
            case AAEvents_1.AAEvents.SPAWN_BOSS: {
                this.bossDead = false;
                this.viewport.follow(null);
                // this.viewport.setSmoothingFactor(4);
                this.viewport.setFocus(this.bossFightCenterPoint);
                this.bossFightActive = true;
                this.bossHealthBar.visible = true;
                this.bossHealthBarBg.visible = true;
                this.bossNameLabel.visible = true;
                // Destroy the spawn trigger so we don't call this again
                this.bossSpawnTrigger.destroy();
                break;
            }
            case "GUIDE": {
                let texts = [""];
                if (MainMenu_1.default.CURRENT_LEVEL === 0) {
                    texts = [
                        "You're finally awake! The Mind Flayer really got us all...",
                        "It seems like you lost most of your magic. But you can get it back.",
                        "Use your tongue as a grapple on concrete surfaces to get around.",
                        "You can also hold the JUMP button to glide with your hat!",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 1) {
                    texts = [
                        "Seems like you'll need to get through this mountain.",
                        "Climb the tree with your tongue spell to reach the top!",
                        "Use your tongue spell on enemies to damage them and gain health.",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 2) {
                    texts = [
                        "Creepy.. This is the cave of the fire ants.",
                        "The exit is at the bottom right of the cave.",
                        "Be careful, the Ant-Queen might be guarding it...",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 3) {
                    texts = [
                        "You've unlocked your fireball! It deals damage to enemies.",
                        "You can also shoot it by your feet for a boost!",
                        "It will allow you to make higher jumps and reach platforms.",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 4) {
                    texts = [
                        "We made it through! We are getting closer to the castle.",
                        "I'm starting to feel the Mind Flayer's presence.",
                        "There is a chance that I could be controlled by him. I'm Sorry",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 5) {
                    texts = [
                        "You were able to get me out of his control. Thank you!",
                        "I passed down my Ice Spell to you. You can freeze enemies with it",
                        "You can create an ice platform by clicking again while its in the air.",
                    ];
                }
                else if (MainMenu_1.default.CURRENT_LEVEL === 6) {
                    texts = [
                        "This is it! Use all your spells to reach the Mind Flayer!",
                        "The future of this world is in your hands.",
                        "Good Luck!.",
                    ];
                }
                if (this.guideTextTimer.isStopped()) {
                    let currentIndex = 0;
                    this.guideText.text = texts[currentIndex];
                    this.textLoopTimer = new Timer_1.default(5000, () => {
                        // Increment the index and wrap around to the beginning of the array if necessary
                        currentIndex = (currentIndex + 1) % texts.length;
                        // Display the next text in the array
                        this.guideText.text = texts[currentIndex];
                        // Restart the timer and show the label
                        this.textLoopTimer.start();
                    });
                    // Start the label timer and show the label
                    this.textLoopTimer.start();
                    this.guideTextTimer.start();
                    this.guideText.backgroundColor.a = 1;
                    this.guideText.textColor.a = 1;
                }
                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`);
            }
        }
    }
    spawnTongue(pos, dir) {
        // TODO maybe use GameNode?
        if (this.tongue && !this.tongue.visible) {
            this.tongue.visible = true;
            this.tongue.setAIActive(true, { src: pos, dir: dir });
        }
    }
    spawnIceBlock(pos) {
        // TODO maybe use GameNode?
        if (this.icePlatform) {
            this.iceParticleSystem.getPool()[0].freeze();
            this.iceParticleSystem.getPool()[0].visible = false;
            this.icePlatform.visible = true;
            this.icePlatform.setAIActive(true, { src: pos });
        }
    }
    handleSelectTongue() {
        this.selectedSpell = SpellTypes_1.SpellTypes.TONGUE;
        this.spellBarSelect.position = this.tongueSelectPos.clone();
    }
    handleSelectFireball() {
        this.selectedSpell = SpellTypes_1.SpellTypes.FIREBALL;
        this.spellBarSelect.position = this.fireballSelectPos.clone();
    }
    handleSelectIce() {
        this.selectedSpell = SpellTypes_1.SpellTypes.ICE;
        this.spellBarSelect.position = this.iceSelectPos.clone();
    }
    /* Handlers for the different events the scene is subscribed to */
    handleFireballHit() {
        const particle = this.fireballSystem.getPool()[0]; // fireball is a single particle
        if (!particle) {
            console.warn("Fireball particle undefined");
            return;
        }
        // Rocket jump direction
        // TODO should be less effective when fireball lands farther away
        const dir = new Vec2_1.default(-0.8 * particle.vel.x, -0.8 * particle.vel.y);
        this.fireballSystem.stopSystem();
        if (!this.fireParticleSystem.isSystemRunning()) {
            this.fireParticleSystem.setParticleVector(dir);
            this.fireParticleSystem.startSystem(1000, 0, particle.position);
        }
        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_FIRE_JUMP, {
            fireJumpVel: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.explodeAudioKey,
            loop: false,
            holdReference: false,
        });
    }
    handleAntFireballHit() {
        const particle = this.antParticleSystem.getPool()[0]; // fireball is a single particle
        if (!particle) {
            console.warn("Fireball particle undefined");
            return;
        }
        // Rocket jump direction
        // TODO should be less effective when fireball lands farther away
        const dir = new Vec2_1.default(-0.1 * particle.vel.x, -0.1 * particle.vel.y);
        this.antParticleSystem.stopSystem();
        if (!this.fireParticleSystem.isSystemRunning()) {
            this.fireParticleSystem.setParticleVector(dir);
            this.fireParticleSystem.startSystem(1000, 0, particle.position);
        }
        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_FIRE_JUMP, {
            fireJumpVel: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.explodeAudioKey,
            loop: false,
            holdReference: false,
        });
    }
    handleTongueHit() {
        const particle = this.tongueParticleSystem.getPool()[0]; // fireball is a single particle
        if (!particle) {
            console.warn("Tongue particle undefined");
            return;
        }
        // gotta change this for the swing
        // let dir = new Vec2(particle.vel.x/2, particle.vel.y/2);
        const dir = this.player.position.dirTo(particle.position).scale(250, 350).scale(1.2);
        this.tongueParticleSystem.stopSystem();
        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_SWING, {
            swingDir: dir,
            particlePos: particle.position,
            playerPos: this.player.position,
        });
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.grappleAudioKey,
            loop: false,
            holdReference: false,
        });
    }
    /**
     * Handle the event when the player enters the level end area.
     */
    handleEnteredLevelEnd() {
        this.bossDead = true;
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     *
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    handleHealthChange(healthBar, healthBarBg, currentHealth, maxHealth) {
        const unit = healthBarBg.size.x / maxHealth;
        healthBar.size.set(healthBarBg.size.x - unit * (maxHealth - currentHealth), healthBarBg.size.y);
        healthBar.position.set(healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), healthBarBg.position.y);
        healthBar.backgroundColor =
            currentHealth < (maxHealth * 1) / 4
                ? Color_1.default.RED
                : currentHealth < (maxHealth * 3) / 4
                    ? Color_1.default.YELLOW
                    : Color_1.default.GREEN;
    }
    handlePauseGame() {
        MainMenu_1.default.GAME_PLAYING = false;
        this.player.setAIActive(false, null);
        this.player.animation.pause();
        this.allNPCS.forEach((npc) => {
            // npc.setAIActive(false, null)
            npc.freeze();
            if (npc.animation) {
                npc.animation.pause();
            }
        });
        this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, {
            key: this.levelMusicKey,
            holdReference: true,
        });
        this.getLayer(exports.AALayers.PAUSE).enable();
    }
    handleResumeGame() {
        MainMenu_1.default.GAME_PLAYING = true;
        this.player.setAIActive(true, {
            fireParticleSystem: this.fireParticleSystem,
            fireballSystem: this.fireballSystem,
            iceParticleSystem: this.iceParticleSystem,
            tongueParticleSystem: this.tongueParticleSystem,
            tilemap: "Destructable",
        });
        this.player.animation.resume();
        this.allNPCS.forEach((npc) => {
            // npc.setAIActive(true, {})
            npc.unfreeze();
            if (npc.animation) {
                npc.animation.resume();
            }
        });
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, {
            key: this.levelMusicKey,
            loop: true,
            holdReference: true,
        });
        this.getLayer(exports.AALayers.PAUSE).disable();
    }
    handleShowControls() {
        this.getLayer(exports.AALayers.PAUSE).disable();
        this.getLayer(exports.AALayers.CONTROLS).enable();
    }
    handleShowHelp() {
        this.getLayer(exports.AALayers.PAUSE).disable();
        this.getLayer(exports.AALayers.HELP).enable();
    }
    /* Initialization methods for everything in the scene */
    /**
     * Initialzes the layers
     */
    initLayers() {
        // Add a layer for UI
        this.addUILayer(exports.AALayers.UI);
        // Add a layer for players and enemies
        // this.addLayer(AALayers.PRIMARY, 1);
        this.addLayer(exports.AALayers.TONGUE, 1);
        this.addLayer(exports.AALayers.GUIDE, 0);
        this.addLayer(exports.AALayers.PRIMARY, 5);
        // this.addLayer(AALayers.GUIDE, 1);
        // For some reason it needs -1 to render behind the tilemap
        this.addLayer(exports.AALayers.BACKGROUND, -1);
        // Add a layer for Pause Menu
        this.addUILayer(exports.AALayers.PAUSE);
        this.addUILayer(exports.AALayers.CONTROLS);
        this.addUILayer(exports.AALayers.HELP);
    }
    initBackground() {
        this.prevViewportCenter = null;
        this.bg = this.add.sprite(this.backgroundKey, exports.AALayers.BACKGROUND);
        this.bg.scale.set(this.bgScale.x, this.bgScale.y);
        this.bg.position.copy(this.bgOffset);
    }
    moveBackground(deltaT) {
        if (!this.prevViewportCenter) {
            this.prevViewportCenter = this.viewport.getView().center.clone();
        }
        // The viewport is stupid and has a different start value depending on the last scene or something
        // and then slowly moves to the correct value, so wait for that to happen here
        if (!this.viewportNormalized &&
            !this.prevViewportCenter.equals(this.viewport.getView().center)) {
            console.log("Viewport not normalized yet, skipping");
            this.prevViewportCenter = this.viewport.getView().center.clone();
            return;
        }
        else {
            this.viewportNormalized = true;
        }
        const diff = this.viewport
            .getView()
            .center.clone()
            .sub(this.prevViewportCenter)
            .scaled(this.bgMovementScale); // Controls how fast the bg scrolls
        this.bg.position.add(new Vec2_1.default(diff.x, this.bgMovementScaleY * diff.y));
        this.prevViewportCenter = this.viewport.getView().center.clone();
    }
    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    initializeTilemap() {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        }
        // Add the tilemap to the scene
        this.add.tilemap(this.tilemapKey, this.tilemapScale);
        if (this.collidableLayerKey === undefined) {
            throw new Error("Make sure the keys for the collidable layer and tongue collidable layer are both set");
        }
        // Get the wall and destructible layers
        //this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        this.collidable = this.getTilemap(this.collidableLayerKey);
        // Add physics to the destructible layer of the tilemap
        if (this.collidable) {
            this.collidable.addPhysics();
            this.collidable.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.DESTRUCTABLE);
            this.collidable.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.PARTICLE_HIT_DESTRUCTIBLE, null);
            this.collidable.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ANT_PARTICLE, AAEvents_1.AAEvents.ANT_FIRE_HIT, null);
            this.collidable.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_WALL_COLLISION, null);
            this.collidable.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICE_COLLISION, null);
        }
    }
    /**
     * Handles all subscriptions to events
     */
    subscribeToEvents() {
        this.receiver.subscribe("NPC_BOSS_KILLED");
        this.receiver.subscribe(AAEvents_1.AAEvents.ANT_FIRE_HIT);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(AAEvents_1.AAEvents.LEVEL_START);
        this.receiver.subscribe(AAEvents_1.AAEvents.LEVEL_END);
        this.receiver.subscribe(AAEvents_1.AAEvents.TONGUE_WALL_COLLISION);
        this.receiver.subscribe(AAEvents_1.AAEvents.PARTICLE_HIT_DESTRUCTIBLE);
        this.receiver.subscribe(AAEvents_1.AAEvents.ICE_COLLISION);
        this.receiver.subscribe(AAEvents_1.AAEvents.HEALTH_CHANGE);
        this.receiver.subscribe(AAEvents_1.AAEvents.PLAYER_DEAD);
        this.receiver.subscribe(AAEvents_1.AAEvents.NPC_KILLED);
        this.receiver.subscribe(AAEvents_1.AAEvents.SHOOT_TONGUE);
        this.receiver.subscribe(AAEvents_1.AAEvents.SELECT_TONGUE);
        this.receiver.subscribe(AAEvents_1.AAEvents.SELECT_FIREBALL);
        this.receiver.subscribe(AAEvents_1.AAEvents.SELECT_ICE);
        this.receiver.subscribe(AAEvents_1.AAEvents.PAUSE);
        this.receiver.subscribe(AAEvents_1.AAEvents.RESUME);
        this.receiver.subscribe(AAEvents_1.AAEvents.CONTROLS);
        this.receiver.subscribe(AAEvents_1.AAEvents.HELP);
        this.receiver.subscribe(AAEvents_1.AAEvents.CREATE_PLATFORM);
        this.receiver.subscribe(AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY);
        this.receiver.subscribe(AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY);
        this.receiver.subscribe(AAEvents_1.AAEvents.TONGUE_HIT_ENEMY);
        this.receiver.subscribe(AAEvents_1.AAEvents.ICE_HIT_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.TONGUE_HIT_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.SPAWN_BOSS);
        this.receiver.subscribe(AAEvents_1.AAEvents.GOTO_BOSS);
        this.receiver.subscribe("GUIDE");
        this.receiver.subscribe("STOP_SHOWING");
    }
    /**
     * Adds in any necessary UI to the game
     */
    initializeUI() {
        // HP Label
        // this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(10, 15), text: "HP "});
        // this.healthLabel.size.set(300, 30);
        // this.healthLabel.fontSize = 24;
        // this.healthLabel.font = "Courier";
        // HealthBar
        this.healthBar = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(45, 15),
            text: "",
        });
        this.healthBar.size = new Vec2_1.default(300, 25);
        this.healthBar.backgroundColor = Color_1.default.GREEN;
        this.healthBar.borderRadius = 0;
        // HealthBar Border
        this.healthBarBg = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(45, 15),
            text: "",
        });
        this.healthBarBg.size = new Vec2_1.default(300, 25);
        this.healthBarBg.borderColor = Color_1.default.BLACK;
        this.healthBarBg.borderRadius = 0;
        this.healthBarBg.borderWidth = 2;
        // Boss Healthbar (displays on boss trigger)
        this.bossHealthBar = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(150, 170),
            text: "",
        });
        this.bossHealthBar.size = new Vec2_1.default(600, 25);
        this.bossHealthBar.backgroundColor = Color_1.default.GREEN;
        this.bossHealthBar.borderRadius = 0;
        this.bossHealthBar.visible = false;
        this.bossHealthBarBg = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(150, 170),
            text: "",
        });
        this.bossHealthBarBg.size = new Vec2_1.default(600, 25);
        this.bossHealthBarBg.borderColor = Color_1.default.BLACK;
        this.bossHealthBarBg.borderRadius = 0;
        this.bossHealthBarBg.borderWidth = 2;
        this.bossHealthBarBg.visible = false;
        // Boss name
        this.bossNameLabel = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(95, 162),
            text: this.bossName || "",
        });
        this.bossNameLabel.size.set(300, 30);
        this.bossNameLabel.fontSize = 24;
        this.bossNameLabel.font = "Courier";
        this.bossNameLabel.visible = false;
        // The tongue icon sprite
        this.tongueIcon =
            MainMenu_1.default.CURRENT_LEVEL >= 0
                ? this.add.sprite("tongueIcon", exports.AALayers.UI)
                : this.add.sprite("lockIcon", exports.AALayers.UI);
        this.tongueIcon.scale.set(0.7, 0.7);
        this.tongueIcon.position.copy(this.tongueSelectPos);
        const oneText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: this.tongueSelectPos.clone().sub(new Vec2_1.default(4, 3)),
            text: "1",
        });
        oneText.size.set(30, 30);
        oneText.fontSize = 16;
        oneText.font = "Courier";
        // The fire icon sprite
        this.fireIcon =
            MainMenu_1.default.CURRENT_LEVEL >= 3
                ? this.add.sprite("fireIcon", exports.AALayers.UI)
                : this.add.sprite("lockIcon", exports.AALayers.UI);
        this.fireIcon.scale.set(0.7, 0.7);
        this.fireIcon.position.copy(this.fireballSelectPos);
        const twoText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: this.fireballSelectPos.clone().sub(new Vec2_1.default(4, 3)),
            text: "2",
        });
        twoText.size.set(30, 30);
        twoText.fontSize = 16;
        twoText.font = "Courier";
        // The ice icon sprite
        this.iceIcon =
            MainMenu_1.default.CURRENT_LEVEL >= 5
                ? this.add.sprite("iceIcon", exports.AALayers.UI)
                : this.add.sprite("lockIcon", exports.AALayers.UI);
        this.iceIcon.scale.set(0.7, 0.7);
        this.iceIcon.position.copy(this.iceSelectPos);
        const threeText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: this.iceSelectPos.clone().sub(new Vec2_1.default(4, 3)),
            text: "3",
        });
        threeText.size.set(30, 30);
        threeText.fontSize = 16;
        threeText.font = "Courier";
        // Spellbar highlighted spell border thing
        this.spellBarSelect = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: this.tongueSelectPos,
            text: "",
        });
        this.spellBarSelect.size = new Vec2_1.default(45, 45);
        this.spellBarSelect.borderColor = Color_1.default.YELLOW;
        this.spellBarSelect.borderRadius = 0;
        this.spellBarSelect.borderWidth = 2;
        // End of level label (start off screen)
        this.levelEndLabel = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.UI, {
            position: new Vec2_1.default(-300, 100),
            text: "Level Complete",
        });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color_1.default(34, 32, 52);
        this.levelEndLabel.textColor = Color_1.default.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";
        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.posX,
                    start: -300,
                    end: 150,
                    ease: EaseFunctions_1.EaseFunctionType.OUT_SINE,
                },
            ],
        });
        this.levelTransitionScreen = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.UI, {
            position: new Vec2_1.default(300, 200),
            size: new Vec2_1.default(600, 400),
        });
        this.levelTransitionScreen.color = new Color_1.default(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;
        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.LEVEL_END],
        });
        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.LEVEL_START],
        });
        // Guide Textbox
        this.guideText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.GUIDE, {
            position: new Vec2_1.default(0, 0),
            text: "Hello There!",
        });
        this.guideText.size.set(600, 150);
        this.guideText.borderRadius = 25;
        this.guideText.backgroundColor = new Color_1.default(34, 32, 52, 0);
        this.guideText.textColor = Color_1.default.WHITE;
        this.guideText.textColor.a = 0;
        this.guideText.backgroundColor.a = 0;
        this.guideText.fontSize = 24;
        this.guideText.font = "MyFont";
        this.guideText.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
        this.guideText.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: GameNode_1.TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
    }
    initializePause() {
        const size = this.viewport.getHalfSize();
        const yPos = size.y + 100;
        const pauseMenu = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.PAUSE, {
            position: new Vec2_1.default(size.x, yPos - 100),
            size: new Vec2_1.default(60, 100),
        });
        pauseMenu.color = Color_1.default.BLACK;
        const resumeBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.PAUSE, {
            position: new Vec2_1.default(size.x, yPos - 130),
            text: "Resume",
        });
        resumeBtn.backgroundColor = Color_1.default.TRANSPARENT;
        resumeBtn.borderColor = Color_1.default.WHITE;
        resumeBtn.borderRadius = 0;
        resumeBtn.setPadding(new Vec2_1.default(50, 10));
        resumeBtn.font = "PixelSimple";
        resumeBtn.scale = new Vec2_1.default(0.25, 0.25);
        const controlsBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.PAUSE, {
            position: new Vec2_1.default(size.x, yPos - 110),
            text: "Controls",
        });
        controlsBtn.backgroundColor = Color_1.default.TRANSPARENT;
        controlsBtn.borderColor = Color_1.default.WHITE;
        controlsBtn.borderRadius = 0;
        controlsBtn.setPadding(new Vec2_1.default(50, 10));
        controlsBtn.font = "PixelSimple";
        controlsBtn.scale = new Vec2_1.default(0.25, 0.25);
        const helpBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.PAUSE, {
            position: new Vec2_1.default(size.x, yPos - 90),
            text: "Help",
        });
        helpBtn.backgroundColor = Color_1.default.TRANSPARENT;
        helpBtn.borderColor = Color_1.default.WHITE;
        helpBtn.borderRadius = 0;
        helpBtn.setPadding(new Vec2_1.default(50, 10));
        helpBtn.font = "PixelSimple";
        helpBtn.scale = new Vec2_1.default(0.25, 0.25);
        const quitBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.PAUSE, {
            position: new Vec2_1.default(size.x, yPos - 70),
            text: "Quit",
        });
        quitBtn.backgroundColor = Color_1.default.TRANSPARENT;
        quitBtn.borderColor = Color_1.default.WHITE;
        quitBtn.borderRadius = 0;
        quitBtn.setPadding(new Vec2_1.default(50, 10));
        quitBtn.font = "PixelSimple";
        quitBtn.scale = new Vec2_1.default(0.25, 0.25);
        resumeBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents_1.AAEvents.RESUME);
        };
        controlsBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents_1.AAEvents.CONTROLS);
        };
        helpBtn.onClick = () => {
            this.emitter.fireEvent(AAEvents_1.AAEvents.HELP);
        };
        quitBtn.onClick = () => {
            MainMenu_1.default.GAME_PLAYING = false;
            ParticleSystemManager_1.default.getInstance().clearParticleSystems();
            this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_MUSIC, {
                key: MainMenu_1.default.MUSIC_KEY,
                loop: true,
                holdReference: true,
            });
            this.sceneManager.changeToScene(MainMenu_1.default);
        };
    }
    initializeControls() {
        const size = this.viewport.getHalfSize();
        const yOffset = 10;
        const controlsMenu = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y),
            size: new Vec2_1.default(100, 130),
        });
        controlsMenu.color = Color_1.default.BLACK;
        let i = 1;
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55),
            text: "W - Jump",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "A - Walk Left",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "D - Walk Right",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "1 - Select Spell 1",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "2 - Select Spell 2",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "3 - Select Spell 3",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "Left Click - Cast Spell",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "Move Mouse - Aim Spell",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, size.y - 55 + yOffset * i++),
            text: "ESC - Pause Game",
            fontSize: 24,
        });
        const backBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.CONTROLS, {
            position: new Vec2_1.default(size.x, 2 * size.y - 50),
            text: "Back",
        });
        backBtn.backgroundColor = Color_1.default.TRANSPARENT;
        backBtn.borderColor = Color_1.default.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2_1.default(50, 10));
        backBtn.font = "PixelSimple";
        backBtn.scale = new Vec2_1.default(0.25, 0.25);
        backBtn.onClick = () => {
            this.getLayer(exports.AALayers.CONTROLS).disable();
            this.getLayer(exports.AALayers.PAUSE).enable();
        };
    }
    initializeHelp() {
        const size = this.viewport.getHalfSize();
        const yOffset = 10;
        const helpMenu = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y),
            size: new Vec2_1.default(140, 100),
        });
        helpMenu.color = Color_1.default.BLACK;
        let i = 1;
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y - 35),
            text: "- Numbers 4-0 to go to levels 0-6 respectively",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y - 35 + yOffset * i++),
            text: "- Shift to go to boss fight if there is one",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y - 35 + yOffset * i++),
            text: "- I to enable invincibility",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y - 35 + yOffset * i++),
            text: "- K to kill the player",
            fontSize: 24,
        });
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, size.y - 35 + yOffset * i++),
            text: "- L to unlock all spells",
            fontSize: 24,
        });
        const backBtn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.AALayers.HELP, {
            position: new Vec2_1.default(size.x, 2 * size.y - 70),
            text: "Back",
        });
        backBtn.backgroundColor = Color_1.default.TRANSPARENT;
        backBtn.borderColor = Color_1.default.WHITE;
        backBtn.borderRadius = 0;
        backBtn.setPadding(new Vec2_1.default(50, 10));
        backBtn.font = "PixelSimple";
        backBtn.scale = new Vec2_1.default(0.25, 0.25);
        backBtn.onClick = () => {
            this.getLayer(exports.AALayers.HELP).disable();
            this.getLayer(exports.AALayers.PAUSE).enable();
        };
    }
    /**
     * Initializes the particles system used by the player's weapon.
     */
    initializeWeaponSystem() {
        this.fireParticleSystem = new FireParticles_1.default(50, Vec2_1.default.ZERO, 1000, 3, 10, 50); // TODO try changing mass to see if it affects gravity?
        this.fireParticleSystem.initializePool(this, exports.AALayers.PRIMARY);
        this.fireballSystem = new Fireball_1.default(1, Vec2_1.default.ZERO, 1000, 3, 0, 1);
        this.fireballSystem.initializePool(this, exports.AALayers.PRIMARY);
        // init tongue
        this.tongue = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.TONGUE, {
            position: Vec2_1.default.ZERO,
            size: Vec2_1.default.ZERO,
        });
        this.tongue.useCustomShader(TongueShaderType_1.default.KEY);
        this.tongue.color = Color_1.default.RED;
        this.tongue.visible = false;
        this.tongue.addAI(TongueBehavior_1.default, { src: Vec2_1.default.ZERO, dir: Vec2_1.default.ZERO });
        this.tongueParticleSystem = new TongueParticle_1.default(1, Vec2_1.default.ZERO, 1000, 3, 0, 1);
        this.tongueParticleSystem.initializePool(this, exports.AALayers.PRIMARY);
        //init ice platform
        this.icePlatform = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.PRIMARY, {
            position: Vec2_1.default.ZERO,
            size: Vec2_1.default.ZERO,
        });
        //this.icePlatform.useCustomShader(TongueShaderType.KEY);
        this.icePlatform.color = Color_1.default.CYAN;
        this.icePlatform.visible = false;
        this.icePlatform.addAI(IceBehavior_1.default, { src: Vec2_1.default.ZERO });
        this.icePlatform.addPhysics();
        this.icePlatform.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PLATFORM);
        this.icePlatform.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_WALL_COLLISION, null);
        this.icePlatform.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.PARTICLE_HIT_DESTRUCTIBLE, null);
        this.icePlatform.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICE_COLLISION, null);
        // initialize Ice Blast
        this.iceParticleSystem = new IceParticles_1.default(1, Vec2_1.default.ZERO, 2000, 3, 10, 1);
        this.iceParticleSystem.initializePool(this, exports.AALayers.PRIMARY);
    }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    initializePlayer(key) {
        if (this.fireParticleSystem === undefined) {
            throw new Error("Fire particle system must be initialized before initializing the player!");
        }
        if (this.iceParticleSystem === undefined) {
            throw new Error("Ice particle system must be initialized before initializing the player!");
        }
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }
        // Add the player to the scene
        this.player = this.add.animatedSprite(key, exports.AALayers.PRIMARY);
        this.player.scale.set(0.25, 0.25);
        this.player.position.copy(this.playerSpawn);
        // Give the player physics and setup collision groups and triggers for the player
        this.player.addPhysics(new AABB_1.default(this.player.position.clone(), this.player.boundary.getHalfSize().clone()));
        this.player.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER);
        this.player.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.BOSS_PARTICLE, AAEvents_1.AAEvents.PLAYER_HIT, null);
        this.player.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ANT_PARTICLE, AAEvents_1.AAEvents.ANT_FIRE_HIT, null);
        this.player.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY_PARTICLE, AAEvents_1.AAEvents.PLAYER_HIT, null);
        this.player.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY, AAEvents_1.AAEvents.PLAYER_HIT, null);
        // Give the player a flip animation
        this.player.tweens.add(PlayerController_1.PlayerTweens.FLIP, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2 * Math.PI,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
        });
        // Give the player a death animation
        this.player.tweens.add(PlayerController_1.PlayerTweens.DEATH, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.PLAYER_DEAD],
        });
        // Give the player it's AI
        // This is just the option object, can pass in whatever "weapons" we want here
        this.player.addAI(PlayerController_1.default, {
            fireParticleSystem: this.fireParticleSystem,
            fireballSystem: this.fireballSystem,
            iceParticleSystem: this.iceParticleSystem,
            tongueParticleSystem: this.tongueParticleSystem,
            tongueGraphic: this.tongue,
            tilemap: "Destructable",
            allNPCs: this.allNPCS,
        });
        this.emitter.fireEvent(AAEvents_1.AAEvents.PLAYER_CREATED, {
            player: this.player,
            tongue: this.tongue,
        });
    }
    /**
     * Initializes the viewport
     */
    initializeViewport() {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(4);
        this.viewport.setBounds(0, 0, 512, 512);
        this.viewport.setCenter(0, 0);
    }
    /**
     * Initializes the level end area
     */
    initializeLevelEnds() {
        if (!this.layers.has(exports.AALayers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        if (!this.levelEndPosition || !this.levelEndHalfSize) {
            console.debug("No level end trigger set, hopefully this is intended");
            return;
        }
        this.levelEndArea = this.add.graphic(GraphicTypes_1.GraphicType.RECT, exports.AALayers.PRIMARY, {
            position: this.levelEndPosition,
            size: this.levelEndHalfSize,
        });
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color_1.default(255, 0, 255, 0.2);
    }
    /* Misc methods */
    // Get the key of the player's jump audio file
    getJumpAudioKey() {
        return this.jumpAudioKey;
    }
    getAttackAudioKey() {
        return this.attackAudioKey;
    }
    getHealAudioKey() {
        return this.healAudioKey;
    }
    getHurtAudioKey() {
        return this.hurtAudioKey;
    }
}
exports.default = AALevel;
AALevel.FIRE_ICON_PATH = "hw4_assets/icons/fire-icon.png";
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/GameEventType":27,"../../Wolfie2D/Input/Input":29,"../../Wolfie2D/Nodes/GameNode":37,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Rendering/Animations/ParticleSystemManager":66,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Timing/Timer":95,"../../Wolfie2D/Utils/Color":97,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/Player/FireParticles":130,"../AI/Player/Fireball":131,"../AI/Player/IceParticles":132,"../AI/Player/PlayerController":133,"../AI/Player/SpellTypes":140,"../AI/Player/TongueParticle":141,"../Factory/AAFactoryManager":145,"../Nodes/IceBehavior":148,"../Nodes/TongueBehavior":149,"../Shaders/TongueShaderType":163,"./MainMenu":161}],151:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const AALevel1_1 = __importDefault(require("./AALevel1"));
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const Timer_1 = __importDefault(require("../../Wolfie2D/Timing/Timer"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
class Level0 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level0.TILEMAP_KEY;
        this.tilemapScale = Level0.TILEMAP_SCALE;
        this.collidableLayerKey = Level0.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level0.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level0.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = Level0.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level0.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level0.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = Level0.JUMP_AUDIO_KEY;
        this.attackAudioKey = Level0.ATTACK_AUDIO_KEY;
        this.healAudioKey = Level0.HEAL_AUDIO_KEY;
        this.hurtAudioKey = Level0.HURT_AUDIO_KEY;
        this.explodeAudioKey = Level0.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = Level0.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = Level0.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = Level0.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level0.BACKGROUND_KEY;
        // Level end size and position
        this.levelEndPosition = new Vec2_1.default(800, 115).mult(this.tilemapScale);
        // made bigger for testing
        this.levelEndHalfSize = new Vec2_1.default(32, 30).mult(this.tilemapScale);
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level0;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(8.0, 8.0);
        this.bgOffset = new Vec2_1.default(100, 150).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.5;
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
        this.guideText.position = new Vec2_1.default(290, 347);
        this.guideText.size.set(655, 150);
        // add random tutorial text
        this.tutorialText = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, AALevel_1.AALayers.GUIDE, {
            position: new Vec2_1.default(55, 435),
            text: "A,D-Move  W-Jump",
        });
        this.tutorialText.size = new Vec2_1.default(300, 25);
        this.tutorialText1 = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, AALevel_1.AALayers.GUIDE, {
            position: new Vec2_1.default(55, 445),
            text: "Left Click - Attack",
        });
        this.tutorialText1.size = new Vec2_1.default(300, 25);
        // this.tutorialText.backgroundColor = Color.BLACK;
        // this.tutorialText.backgroundColor.a = 10;
        this.tutorialTextTimer = new Timer_1.default(10000, () => (this.tutorialText.visible = false), false);
    }
    initializeTutorialBox() {
        const size = this.viewport.getHalfSize();
        const tutorialBox = this.add.graphic(GraphicTypes_1.GraphicType.RECT, AALevel_1.AALayers.GUIDE, {
            position: new Vec2_1.default(size.x, size.y),
            size: new Vec2_1.default(100, 100),
        });
        tutorialBox.color = new Color_1.default(34, 32, 52, 0);
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level0.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level0.PLAYER_SPRITE_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        // Load in the guide sprite
        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");
        // Load in ant sprite
        this.load.spritesheet("Ant", "hw4_assets/spritesheets/fire_ant.json");
        // Audio and music
        this.load.audio(this.levelMusicKey, Level0.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level0.JUMP_AUDIO_PATH);
        this.load.audio(this.attackAudioKey, Level0.ATTACK_AUDIO_PATH);
        this.load.audio(this.healAudioKey, Level0.HEAL_AUDIO_PATH);
        this.load.audio(this.hurtAudioKey, Level0.HURT_AUDIO_PATH);
        this.load.audio(this.explodeAudioKey, Level0.EXPLODE_AUDIO_PATH);
        this.load.audio(this.grappleAudioKey, Level0.GRAPPLE_AUDIO_PATH);
        this.load.audio(this.enemyDeathAudioKey, Level0.ENEMY_DEATH_AUDIO_PATH);
        this.load.audio(this.playerDeathAudioKey, Level0.PLAYER_DEATH_AUDIO_PATH);
        this.load.image(this.backgroundKey, Level0.BACKGROUND_PATH);
        this.load.image("fireIcon", "hw4_assets/sprites/fire-icon.png");
        this.load.image("tongueIcon", "hw4_assets/sprites/tongue-icon.png");
        this.load.image("iceIcon", "hw4_assets/sprites/ice-icon.png");
        this.load.image("lockIcon", "hw4_assets/sprites/lock-icon.png");
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
        this.load.keepImage(this.backgroundKey); // same bg used in level1
    }
    startScene() {
        super.startScene();
        this.guideText.tweens.play("fadeIn");
        // Set the next level to be Level1
        this.nextLevel = AALevel1_1.default;
        this.nextLevelNum = 1;
        this.initializeNPCs();
    }
    initializeNPCs() {
        const guide = this.add.animatedSprite("Guide", AALevel_1.AALayers.GUIDE);
        guide.scale.scale(0.3);
        guide.position.set(290, 397);
        guide.addPhysics(null, null, false);
        guide.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL);
        guide.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, "GUIDE", null);
        guide.animation.play("IDLE");
        this.allNPCS.set(guide.id, guide);
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1584, 700);
    }
}
exports.default = Level0;
Level0.PLAYER_SPAWN = new Vec2_1.default(50, 452);
Level0.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level0.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level0.TILEMAP_KEY = "LEVEL1";
Level0.TILEMAP_PATH = "hw4_assets/tilemaps/ForestLevel0.json";
Level0.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level0.COLLIDABLE_LAYER_KEY = "Collidable";
Level0.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level0.WALLS_LAYER_KEY = "Main";
Level0.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level0.LEVEL_MUSIC_PATH = "hw4_assets/music/frog_lvl_1.wav";
Level0.JUMP_AUDIO_KEY = "PLAYER_JUMP";
Level0.JUMP_AUDIO_PATH = "hw4_assets/sounds/jump_alt.wav";
Level0.ATTACK_AUDIO_KEY = "PLAYER_ATTACK";
Level0.ATTACK_AUDIO_PATH = "hw4_assets/sounds/attack.wav";
Level0.HEAL_AUDIO_KEY = "PLAYER_HEAL";
Level0.HEAL_AUDIO_PATH = "hw4_assets/sounds/heal.wav";
Level0.HURT_AUDIO_KEY = "PLAYER_HURT";
Level0.HURT_AUDIO_PATH = "hw4_assets/sounds/hurt.wav";
Level0.EXPLODE_AUDIO_KEY = "EXPLODE";
Level0.EXPLODE_AUDIO_PATH = "hw4_assets/sounds/explode.wav";
Level0.GRAPPLE_AUDIO_KEY = "GRAPPLE";
Level0.GRAPPLE_AUDIO_PATH = "hw4_assets/sounds/grapple.wav";
Level0.ENEMY_DEATH_AUDIO_KEY = "ENEMY_DEATH";
Level0.ENEMY_DEATH_AUDIO_PATH = "hw4_assets/sounds/dying_quieter.wav";
Level0.PLAYER_DEATH_AUDIO_KEY = "PLAYER_DEATH";
Level0.PLAYER_DEATH_AUDIO_PATH = "hw4_assets/sounds/player_death.wav";
Level0.BACKGROUND_KEY = "BACKGROUND";
Level0.BACKGROUND_PATH = "hw4_assets/images/level1.png";
Level0.LEVEL_END = new AABB_1.default(new Vec2_1.default(1400, 232), new Vec2_1.default(24, 16));
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Timing/Timer":95,"../../Wolfie2D/Utils/Color":97,"../AAPhysicsGroups":107,"../CheatsManager":142,"./AALevel":150,"./AALevel1":152}],152:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const AALevel2_1 = __importDefault(require("./AALevel2"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const ScabberBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/ScabberBehavior"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const AALevel0_1 = __importDefault(require("./AALevel0"));
class Level1 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level1.TILEMAP_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.collidableLayerKey = Level1.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level1.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level1.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level1.BACKGROUND_KEY;
        // Level end size and position
        this.levelEndPosition = new Vec2_1.default(2050, 350);
        // made bigger for testing
        this.levelEndHalfSize = new Vec2_1.default(32, 30).mult(this.tilemapScale);
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level1;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(8.0, 12.0);
        this.bgOffset = new Vec2_1.default(100, 220).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.5;
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
        // // Guide Textbox
        // this.guideText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.GUIDE, { position: new Vec2(this.playerSpawn.x + 90, this.playerSpawn.y - 50), text: "I HAVE SO MUCH TO SAY TO YOU" });
        // this.guideText.size.set(550, 180);
        // this.guideText.borderRadius = 25;
        // this.guideText.backgroundColor = new Color(34, 32, 52, 0);
        // this.guideText.textColor = Color.WHITE;
        // this.guideText.textColor.a = 0;
        // this.guideText.fontSize = 24;
        // this.guideText.font = "MyFont";
        this.guideText.position = new Vec2_1.default(471, 891);
        this.guideText.size.set(655, 150);
        //this.guideText.size.set(655, 150);
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        // Load in the guide sprite
        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");
        // Load in ant sprite
        this.load.spritesheet("Ant", "hw4_assets/spritesheets/fire_ant.json");
        this.load.image(this.backgroundKey, Level1.BACKGROUND_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    startScene() {
        super.startScene();
        this.guideText.tweens.play("fadeIn");
        // Set the next level to be Level4
        this.nextLevel = AALevel2_1.default;
        this.nextLevelNum = 2;
        this.initializeNPCs();
    }
    initializeNPCs() {
        this.enemyPositions = [
            new Vec2_1.default(717, 1088),
            new Vec2_1.default(1051, 1024),
            new Vec2_1.default(942, 928),
            new Vec2_1.default(737, 800),
            new Vec2_1.default(1028, 592),
            new Vec2_1.default(727, 432),
            new Vec2_1.default(737, 80),
            new Vec2_1.default(900, 80),
            new Vec2_1.default(1133, 144),
            new Vec2_1.default(1400, 352),
            new Vec2_1.default(1550, 352),
            new Vec2_1.default(737, 800),
            new Vec2_1.default(1851, 304),
        ];
        for (const pos of this.enemyPositions) {
            const scabbers = this.add.animatedSprite("Scabbers", AALevel_1.AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(pos.x, pos.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, scabbers, AALevel_1.AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior_1.default, { player: this.player, tilemap: "Collidable" });
            this.allNPCS.set(scabbers.id, scabbers);
            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        }
        const guide = this.add.animatedSprite("Guide", AALevel_1.AALayers.GUIDE);
        guide.scale.scale(0.3);
        guide.position.set(471, 941);
        guide.addPhysics(null, null, false);
        guide.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL);
        guide.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, "GUIDE", null);
        guide.animation.play("IDLE");
        this.allNPCS.set(guide.id, guide);
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 2065, 1600);
    }
}
exports.default = Level1;
Level1.PLAYER_SPAWN = new Vec2_1.default(50, 935);
Level1.TILEMAP_KEY = "LEVEL1";
Level1.TILEMAP_PATH = "hw4_assets/tilemaps/TreeLevel.json";
Level1.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level1.COLLIDABLE_LAYER_KEY = "Collidable";
Level1.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level1.WALLS_LAYER_KEY = "Main";
Level1.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level1.LEVEL_MUSIC_PATH = "hw4_assets/music/frog_lvl_1.wav";
Level1.BACKGROUND_KEY = "BACKGROUND";
Level1.BACKGROUND_PATH = "hw4_assets/images/level1.png";
Level1.LEVEL_END = new AABB_1.default(new Vec2_1.default(1400, 232), new Vec2_1.default(24, 16));
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/NPCBehaviors/ScabberBehavior":116,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel2":153}],153:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const ScabberBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/ScabberBehavior"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
const AntBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/AntBehavior"));
const AALevel3_1 = __importDefault(require("./AALevel3"));
const AntParticles_1 = __importDefault(require("../AI/NPC/AntParticles"));
const AntQueenBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/AntQueenBehavior"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
class Level2 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level2.TILEMAP_KEY;
        this.tilemapScale = Level2.TILEMAP_SCALE;
        this.collidableLayerKey = Level2.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level2.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level2.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level2.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level2.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level2.BACKGROUND_KEY;
        // made bigger for testing
        this.levelEndHalfSize = new Vec2_1.default(32, 30).mult(this.tilemapScale);
        this.bossSpawnTriggerPos = new Vec2_1.default(1260, 1104);
        this.bossSpawnTriggerHalfSize = new Vec2_1.default(10, 160).mult(this.tilemapScale);
        this.bossFightCenterPoint = new Vec2_1.default(1400, 1040);
        this.bossName = "Ant Queen";
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level2;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(16.0, 16.0);
        this.bgOffset = new Vec2_1.default(400, 400).mult(this.tilemapScale);
        this.bgMovementScale = 0.7; // No parallax
        this.bgMovementScaleY = 0.8; // No parallax
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
        this.guideText.position = new Vec2_1.default(233, 981);
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level2.TILEMAP_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        // Load in the guide sprite
        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");
        // Load in ant sprite
        this.load.spritesheet("Ant", "hw4_assets/spritesheets/fire_ant.json");
        this.load.image(this.backgroundKey, Level2.BACKGROUND_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Ant", "hw4_assets/spritesheets/fire_ant.json");
        // Audio and music
        this.load.audio(this.levelMusicKey, Level2.LEVEL_MUSIC_PATH);
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    startScene() {
        super.startScene();
        this.guideText.tweens.play("fadeIn");
        // Set the next level to be Level4
        this.nextLevel = AALevel3_1.default;
        this.nextLevelNum = 3;
        this.initializeTriggers();
        this.initializeNPCs();
    }
    initializeNPCs() {
        this.bossHealthBar.position = new Vec2_1.default(150, 195);
        this.bossHealthBarBg.position = new Vec2_1.default(150, 195);
        this.bossNameLabel.position = new Vec2_1.default(95, 187);
        // initialize boss weapon system
        this.antParticleSystem = new AntParticles_1.default(1, Vec2_1.default.ZERO, 2000, 3, 10, 1);
        this.antParticleSystem.initializePool(this, AALevel_1.AALayers.PRIMARY);
        const antQueen = this.add.animatedSprite("Ant", AALevel_1.AALayers.PRIMARY);
        antQueen.scale.scale(1.25);
        antQueen.position.set(1405, 1010);
        antQueen.addPhysics(null, null, false);
        antQueen.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
        antQueen.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
        antQueen.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICE_HIT_BOSS, null);
        antQueen.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_BOSS, null);
        antQueen.health = 10;
        antQueen.maxHealth = 10;
        antQueen.addAI(AntQueenBehavior_1.default, {
            player: this.player,
            particles: this.antParticleSystem,
        });
        this.allNPCS.set(antQueen.id, antQueen);
        antQueen.tweens.add("DEATH", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.NPC_KILLED, AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END],
        });
        this.scabberPositions = [
            new Vec2_1.default(503, 1008),
            new Vec2_1.default(258, 848),
            new Vec2_1.default(69, 640),
            new Vec2_1.default(75, 640),
            new Vec2_1.default(824, 416),
        ];
        for (const pos of this.scabberPositions) {
            const scabbers = this.add.animatedSprite("Scabbers", AALevel_1.AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(pos.x, pos.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, scabbers, AALevel_1.AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior_1.default, { player: this.player, tilemap: "Collidable" });
            this.allNPCS.set(scabbers.id, scabbers);
            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        }
        const guide = this.add.animatedSprite("Guide", AALevel_1.AALayers.GUIDE);
        guide.scale.scale(0.3);
        guide.position.set(233, 1021);
        guide.addPhysics(null, null, false);
        guide.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL);
        guide.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, "GUIDE", null);
        guide.animation.play("IDLE");
        this.allNPCS.set(guide.id, guide);
        this.antPositions = [
            new Vec2_1.default(400, 894),
            new Vec2_1.default(470, 300),
            new Vec2_1.default(200, 300),
            new Vec2_1.default(622, 950),
            new Vec2_1.default(438, 750),
            new Vec2_1.default(495, 550),
            new Vec2_1.default(833, 350),
            new Vec2_1.default(1268, 700),
            new Vec2_1.default(936, 576),
            new Vec2_1.default(788, 600),
            new Vec2_1.default(1101, 1000),
            new Vec2_1.default(1000, 1000),
            new Vec2_1.default(1158, 640),
            new Vec2_1.default(1300, 1110),
            new Vec2_1.default(1500, 1110),
        ];
        for (const pos of this.antPositions) {
            const ant = this.add.animatedSprite("Ant", AALevel_1.AALayers.TONGUE);
            ant.scale.scale(0.25);
            ant.position.set(pos.x, pos.y);
            ant.addPhysics(null, null, false);
            ant.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            ant.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            ant.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            ant.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            ant.animation.play("IDLE");
            ant.addAI(AntBehavior_1.default, { player: this.player });
            ant.health = 3;
            ant.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, ant, AALevel_1.AALayers.PRIMARY, {
                size: ant.size.clone().scaled(1.5, 0.125),
                offset: ant.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(ant.id, healthbar);
            this.allNPCS.set(ant.id, ant);
            ant.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        }
    }
    initializeTriggers() {
        this.bossSpawnTrigger = this.add.graphic(GraphicTypes_1.GraphicType.RECT, AALevel_1.AALayers.PRIMARY, {
            position: this.bossSpawnTriggerPos,
            size: this.bossSpawnTriggerHalfSize,
        });
        this.bossSpawnTrigger.color = Color_1.default.TRANSPARENT;
        this.bossSpawnTrigger.addPhysics(undefined, undefined, false, true);
        this.bossSpawnTrigger.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, AAEvents_1.AAEvents.SPAWN_BOSS, null);
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1600, 1300);
    }
}
exports.default = Level2;
Level2.PLAYER_SPAWN = new Vec2_1.default(50, 1100);
Level2.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level2.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level2.TILEMAP_KEY = "LEVEL2";
Level2.TILEMAP_PATH = "hw4_assets/tilemaps/CaveLevel.json";
Level2.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level2.COLLIDABLE_LAYER_KEY = "Collidable";
Level2.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level2.WALLS_LAYER_KEY = "Main";
Level2.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level2.LEVEL_MUSIC_PATH = "hw4_assets/music/frog_lvl_1.wav";
Level2.BACKGROUND_KEY = "BACKGROUND";
Level2.BACKGROUND_PATH = "hw4_assets/images/Cave2.png";
Level2.LEVEL_END = new AABB_1.default(new Vec2_1.default(1400, 232), new Vec2_1.default(24, 16));
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Utils/Color":97,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/AntParticles":108,"../AI/NPC/NPCBehaviors/AntBehavior":111,"../AI/NPC/NPCBehaviors/AntQueenBehavior":112,"../AI/NPC/NPCBehaviors/ScabberBehavior":116,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel3":154}],154:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const AALevel4_1 = __importDefault(require("./AALevel4"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const ScabberBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/ScabberBehavior"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
const AALevel0_1 = __importDefault(require("./AALevel0"));
/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
class Level3 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level3.TILEMAP_KEY;
        this.tilemapScale = Level3.TILEMAP_SCALE;
        this.collidableLayerKey = Level3.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level3.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level3.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level3.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level3.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level3.BACKGROUND_KEY;
        // Level end size and position
        this.levelEndPosition = new Vec2_1.default(1543, 96);
        // made bigger for testing
        this.levelEndHalfSize = new Vec2_1.default(32, 30).mult(this.tilemapScale);
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level3;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(6.0, 7.0);
        this.bgOffset = new Vec2_1.default(100, 100).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.8;
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
        // // Guide Textbox
        // this.guideText = <Label>this.add.uiElement(UIElementType.LABEL, AALayers.GUIDE, { position: new Vec2(this.playerSpawn.x + 90, this.playerSpawn.y - 50), text: "I HAVE SO MUCH TO SAY TO YOU" });
        // this.guideText.size.set(550, 180);
        // this.guideText.borderRadius = 25;
        // this.guideText.backgroundColor = new Color(34, 32, 52, 0);
        // this.guideText.textColor = Color.WHITE;
        // this.guideText.textColor.a = 0;
        // this.guideText.fontSize = 24;
        // this.guideText.font = "MyFont";
        this.guideText.position = new Vec2_1.default(this.playerSpawn.x + 90, this.playerSpawn.y - 30);
    }
    initializeTutorialBox() {
        const size = this.viewport.getHalfSize();
        const tutorialBox = this.add.graphic(GraphicTypes_1.GraphicType.RECT, AALevel_1.AALayers.GUIDE, {
            position: new Vec2_1.default(size.x, size.y),
            size: new Vec2_1.default(100, 100),
        });
        tutorialBox.color = new Color_1.default(34, 32, 52, 0);
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level3.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level3.PLAYER_SPRITE_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        // Load in the guide sprite
        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");
        // Load in ant sprite
        this.load.spritesheet("Ant", "hw4_assets/spritesheets/fire_ant.json");
        // Load background image
        this.load.image(this.backgroundKey, Level3.BACKGROUND_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level3.LEVEL_MUSIC_PATH);
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage(this.backgroundKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    startScene() {
        super.startScene();
        this.guideText.tweens.play("fadeIn");
        // Set the next level to be Level4
        this.nextLevel = AALevel4_1.default;
        this.nextLevelNum = 4;
        this.initializeNPCs();
    }
    initializeNPCs() {
        this.enemyPositions = [
            new Vec2_1.default(200, 950),
            new Vec2_1.default(500, 950),
            new Vec2_1.default(800, 950),
            new Vec2_1.default(1150, 750),
        ];
        for (const pos of this.enemyPositions) {
            const scabbers = this.add.animatedSprite("Scabbers", AALevel_1.AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(pos.x, pos.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, scabbers, AALevel_1.AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior_1.default, { player: this.player, tilemap: "Collidable" });
            this.allNPCS.set(scabbers.id, scabbers);
            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        }
        const guide = this.add.animatedSprite("Guide", AALevel_1.AALayers.GUIDE);
        guide.scale.scale(0.3);
        guide.position.set(this.playerSpawn.x + 90, this.playerSpawn.y + 15);
        guide.addPhysics(null, null, false);
        guide.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL);
        guide.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, "GUIDE", null);
        guide.animation.play("IDLE");
        this.allNPCS.set(guide.id, guide);
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1584, 980);
    }
}
exports.default = Level3;
Level3.PLAYER_SPAWN = new Vec2_1.default(50, 830);
Level3.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level3.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level3.TILEMAP_KEY = "LEVEL1";
Level3.TILEMAP_PATH = "hw4_assets/tilemaps/level3.json";
Level3.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level3.COLLIDABLE_LAYER_KEY = "Collidable";
Level3.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level3.WALLS_LAYER_KEY = "Main";
Level3.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level3.LEVEL_MUSIC_PATH = "hw4_assets/music/lvl2_music.wav";
Level3.BACKGROUND_KEY = "BACKGROUND";
Level3.BACKGROUND_PATH = "hw4_assets/images/DesertBack.png";
Level3.LEVEL_END = new AABB_1.default(new Vec2_1.default(1400, 232), new Vec2_1.default(24, 16));
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Utils/Color":97,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/NPCBehaviors/ScabberBehavior":116,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel4":155}],155:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importDefault(require("./AALevel"));
const AALevel_2 = require("./AALevel");
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
const AALevel3_1 = __importDefault(require("./AALevel3"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const Boss2Behavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/Boss2Behavior"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const AALevel5_1 = __importDefault(require("./AALevel5"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const XvartBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/XvartBehavior"));
/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
class Level4 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level4.TILEMAP_KEY;
        this.tilemapScale = Level4.TILEMAP_SCALE;
        this.collidableLayerKey = Level4.COLLIDABLE_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level4.PLAYER_SPAWN;
        // Music and sound
        this.levelMusicKey = Level4.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = AALevel3_1.default.BACKGROUND_KEY;
        this.bossSpawnTriggerPos = new Vec2_1.default(1321, 660);
        this.bossSpawnTriggerHalfSize = new Vec2_1.default(10, 160).mult(this.tilemapScale);
        this.bossFightCenterPoint = new Vec2_1.default(1433, 620);
        this.bossName = "Traveler";
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level4;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(6.0, 6.2);
        this.bgOffset = new Vec2_1.default(100, 125).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 1.1;
    }
    /**
     * Load in resources for level 2.
     */
    loadScene() {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level4.TILEMAP_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Traveler", "hw4_assets/spritesheets/traveler.json");
        this.load.spritesheet("Xvart", "hw4_assets/spritesheets/xvart.json");
        // Load background image
        this.load.image(this.backgroundKey, AALevel3_1.default.BACKGROUND_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level4.LEVEL_MUSIC_PATH);
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    initializeNPCs() {
        // level boss
        const traveler = this.add.animatedSprite("Traveler", AALevel_2.AALayers.PRIMARY);
        traveler.scale.scale(0.25);
        traveler.position.set(Level4.BOSS_SPAWN.x, Level4.BOSS_SPAWN.y);
        traveler.addPhysics(undefined, undefined, false, false);
        traveler.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
        traveler.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
        traveler.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICE_HIT_BOSS, null);
        traveler.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_BOSS, null);
        traveler.health = 10;
        traveler.maxHealth = 10;
        traveler.addAI(Boss2Behavior_1.default, { player: this.player });
        this.allNPCS.set(traveler.id, traveler);
        traveler.tweens.add("DEATH", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.NPC_KILLED, AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END],
        });
        const locations = [new Vec2_1.default(320, 1632), new Vec2_1.default(640, 1312), new Vec2_1.default(960, 991)];
        locations.forEach((l) => {
            const xvart = this.add.animatedSprite("Xvart", AALevel_2.AALayers.PRIMARY);
            xvart.scale.scale(0.25);
            xvart.position.set(l.x, l.y);
            xvart.addPhysics();
            xvart.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            xvart.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            xvart.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            xvart.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            xvart.health = 3;
            xvart.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, xvart, AALevel_2.AALayers.PRIMARY, {
                size: xvart.size.clone().scaled(1.2, 0.15),
                offset: xvart.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(xvart.id, healthbar);
            xvart.animation.play("IDLE");
            xvart.addAI(XvartBehavior_1.default, { player: this.player, tilemap: "Collidable" }); // add particles here
            this.allNPCS.set(xvart.id, xvart);
            xvart.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        });
    }
    initializeTriggers() {
        this.bossSpawnTrigger = this.add.graphic(GraphicTypes_1.GraphicType.RECT, AALevel_2.AALayers.PRIMARY, {
            position: this.bossSpawnTriggerPos,
            size: this.bossSpawnTriggerHalfSize,
        });
        this.bossSpawnTrigger.color = Color_1.default.TRANSPARENT;
        this.bossSpawnTrigger.addPhysics(undefined, undefined, false, true);
        this.bossSpawnTrigger.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, AAEvents_1.AAEvents.SPAWN_BOSS, null);
    }
    startScene() {
        super.startScene();
        this.nextLevel = AALevel5_1.default;
        this.nextLevelNum = 5;
        this.initializeNPCs();
        this.initializeTriggers();
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        this.cheatsManager.update(deltaT);
    }
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1584, 2600);
    }
}
exports.default = Level4;
Level4.PLAYER_SPAWN = new Vec2_1.default(32, 1750);
Level4.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level4.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level4.BOSS_SPAWN = new Vec2_1.default(1500, 670);
Level4.TILEMAP_KEY = "LEVEL2";
Level4.TILEMAP_PATH = "hw4_assets/tilemaps/boss_desert_new.json";
Level4.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level4.COLLIDABLE_LAYER_KEY = "Collidable";
Level4.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level4.LEVEL_MUSIC_PATH = "hw4_assets/music/lvl2_music.wav";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Utils/Color":97,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/NPCBehaviors/Boss2Behavior":113,"../AI/NPC/NPCBehaviors/XvartBehavior":117,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel3":154,"./AALevel5":156}],156:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AABB_1 = __importDefault(require("../../Wolfie2D/DataTypes/Shapes/AABB"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const ScabberBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/ScabberBehavior"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const AALevel6_1 = __importDefault(require("./AALevel6"));
const RangedEnemyBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/RangedEnemyBehavior"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
const RangedEnemyParticles_1 = __importDefault(require("../AI/NPC/RangedEnemyParticles"));
/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
class Level5 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level5.TILEMAP_KEY;
        this.tilemapScale = Level5.TILEMAP_SCALE;
        this.collidableLayerKey = Level5.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level5.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level5.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level5.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level5.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = Level5.BACKGROUND_KEY;
        // Level end size and position
        this.levelEndPosition = new Vec2_1.default(736, 24).mult(this.tilemapScale);
        // made bigger for testing
        this.levelEndHalfSize = new Vec2_1.default(16, 32).mult(this.tilemapScale);
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level5;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(7.0, 7.0);
        this.bgOffset = new Vec2_1.default(120, 80).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.7;
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
        this.guideText.position = new Vec2_1.default(100, 587);
        this.guideText.size.set(655, 150);
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level5.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level5.PLAYER_SPRITE_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        this.load.spritesheet("Ultroloth", "hw4_assets/spritesheets/ultroloth.json");
        this.load.spritesheet("Guide", "hw4_assets/spritesheets/traveler.json");
        this.load.image(this.backgroundKey, Level5.BACKGROUND_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level5.LEVEL_MUSIC_PATH);
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    startScene() {
        super.startScene();
        // Set the next level to be Level6
        this.nextLevel = AALevel6_1.default;
        this.nextLevelNum = 6;
        this.initializeNPCs();
    }
    initializeNPCs() {
        const melee = [
            // new Vec2(136, 640),
            new Vec2_1.default(184, 288),
            new Vec2_1.default(248, 384),
            new Vec2_1.default(1120, 368),
            new Vec2_1.default(488, 288),
            new Vec2_1.default(860, 512),
            new Vec2_1.default(1442, 640),
            new Vec2_1.default(1556, 432),
            new Vec2_1.default(1556, 256),
        ];
        const ranged = [
            new Vec2_1.default(140, 64),
            new Vec2_1.default(329, 640),
            new Vec2_1.default(1024, 640),
            new Vec2_1.default(625, 640),
            new Vec2_1.default(1416, 640),
            new Vec2_1.default(1335, 368),
            new Vec2_1.default(712, 240),
            new Vec2_1.default(1090, 640),
        ];
        melee.forEach((l) => {
            const scabbers = this.add.animatedSprite("Scabbers", AALevel_1.AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(l.x, l.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, scabbers, AALevel_1.AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior_1.default, { player: this.player, tilemap: "Collidable" }); // add particles here
            this.allNPCS.set(scabbers.id, scabbers);
            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
            const guide = this.add.animatedSprite("Guide", AALevel_1.AALayers.GUIDE);
            guide.scale.scale(0.3);
            guide.position.set(100, 637);
            guide.addPhysics(null, null, false);
            guide.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.TUTORIAL);
            guide.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, "GUIDE", null);
            guide.animation.play("IDLE");
            this.allNPCS.set(guide.id, guide);
        });
        ranged.forEach((l) => {
            this.rangedEnemyParticleSystem = new RangedEnemyParticles_1.default(1, Vec2_1.default.ZERO, 1000, 3, 10, 1);
            this.rangedEnemyParticleSystem.initializePool(this, AALevel_1.AALayers.PRIMARY);
            const particles = this.rangedEnemyParticleSystem.getPool();
            particles.forEach((particle) => this.allNPCS.set(particle.id, particle));
            const ultroloth = this.add.animatedSprite("Ultroloth", AALevel_1.AALayers.PRIMARY);
            ultroloth.scale.scale(0.25);
            ultroloth.position.set(l.x, l.y);
            ultroloth.addPhysics();
            ultroloth.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            ultroloth.health = 3;
            ultroloth.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, ultroloth, AALevel_1.AALayers.PRIMARY, {
                size: ultroloth.size.clone().scaled(1, 0.15),
                offset: ultroloth.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(ultroloth.id, healthbar);
            ultroloth.animation.play("IDLE");
            ultroloth.addAI(RangedEnemyBehavior_1.default, {
                player: this.player,
                particles: this.rangedEnemyParticleSystem,
                tilemap: "Collidable",
            });
            this.allNPCS.set(ultroloth.id, ultroloth);
            ultroloth.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        });
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1584, 700);
    }
}
exports.default = Level5;
Level5.PLAYER_SPAWN = new Vec2_1.default(50, 630);
Level5.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level5.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level5.TILEMAP_KEY = "LEVEL1";
Level5.TILEMAP_PATH = "hw4_assets/tilemaps/AALevel5.json";
Level5.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level5.COLLIDABLE_LAYER_KEY = "Collidable";
Level5.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level5.WALLS_LAYER_KEY = "Main";
Level5.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level5.LEVEL_MUSIC_PATH = "hw4_assets/music/dark_level_music.wav";
Level5.BACKGROUND_KEY = "BACKGROUND";
Level5.BACKGROUND_PATH = "hw4_assets/images/Castle.png";
Level5.LEVEL_END = new AABB_1.default(new Vec2_1.default(1400, 232), new Vec2_1.default(24, 16));
},{"../../Wolfie2D/DataTypes/Shapes/AABB":14,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/NPCBehaviors/RangedEnemyBehavior":115,"../AI/NPC/NPCBehaviors/ScabberBehavior":116,"../AI/NPC/RangedEnemyParticles":129,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel6":157}],157:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const AALevel_1 = __importStar(require("./AALevel"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const AAPhysicsGroups_1 = require("../AAPhysicsGroups");
const AAEvents_1 = require("../AAEvents");
const ScabberBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/ScabberBehavior"));
const HealthbarHUD_1 = __importDefault(require("../GameSystems/HUD/HealthbarHUD"));
const CheatsManager_1 = __importDefault(require("../CheatsManager"));
const EaseFunctions_1 = require("../../Wolfie2D/Utils/EaseFunctions");
const MainMenu_1 = __importDefault(require("./MainMenu"));
const RangedEnemyBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/RangedEnemyBehavior"));
const RangedEnemyParticles_1 = __importDefault(require("../AI/NPC/RangedEnemyParticles"));
const MindFlayerParticles_1 = __importDefault(require("../AI/NPC/MindFlayerParticles"));
const GraphicTypes_1 = require("../../Wolfie2D/Nodes/Graphics/GraphicTypes");
const MindFlayerBehavior_1 = __importDefault(require("../AI/NPC/NPCBehaviors/MindFlayerBehavior"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
const AALevel5_1 = __importDefault(require("./AALevel5"));
/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
class Level6 extends AALevel_1.default {
    constructor(viewport, sceneManager, renderingManager, options) {
        super(viewport, sceneManager, renderingManager, options);
        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level6.TILEMAP_KEY;
        this.tilemapScale = Level6.TILEMAP_SCALE;
        this.collidableLayerKey = Level6.COLLIDABLE_LAYER_KEY;
        this.tongueCollidableLayerKey = Level6.TONGUE_COLLIDABLE_LAYER_KEY;
        this.wallsLayerKey = Level6.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = AALevel0_1.default.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level6.PLAYER_SPAWN;
        // Set the key for the spells sprite
        // Music and sound
        this.levelMusicKey = Level6.LEVEL_MUSIC_KEY;
        this.jumpAudioKey = AALevel0_1.default.JUMP_AUDIO_KEY;
        this.attackAudioKey = AALevel0_1.default.ATTACK_AUDIO_KEY;
        this.healAudioKey = AALevel0_1.default.HEAL_AUDIO_KEY;
        this.hurtAudioKey = AALevel0_1.default.HURT_AUDIO_KEY;
        this.explodeAudioKey = AALevel0_1.default.EXPLODE_AUDIO_KEY;
        this.grappleAudioKey = AALevel0_1.default.GRAPPLE_AUDIO_KEY;
        this.enemyDeathAudioKey = AALevel0_1.default.ENEMY_DEATH_AUDIO_KEY;
        this.playerDeathAudioKey = AALevel0_1.default.PLAYER_DEATH_AUDIO_KEY;
        this.backgroundKey = AALevel5_1.default.BACKGROUND_KEY;
        this.bossSpawnTriggerPos = new Vec2_1.default(162, 600).mult(this.tilemapScale);
        this.bossSpawnTriggerHalfSize = new Vec2_1.default(4, 16).mult(this.tilemapScale);
        this.bossFightCenterPoint = new Vec2_1.default(84, 583).mult(this.tilemapScale);
        this.bossName = "Mind Flayer";
        // Initialize cheats
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager = new CheatsManager_1.default(this.sceneManager, {
            levelMusicKey: this.levelMusicKey,
        });
        this.currLevel = Level6;
        MainMenu_1.default.BOSS_LOCATION = this.bossSpawnTriggerPos;
        // Setup bg stuff
        this.bgScale = new Vec2_1.default(10.0, 10.0);
        this.bgOffset = new Vec2_1.default(150, 180).mult(this.tilemapScale);
        this.bgMovementScale = 0.7;
        this.bgMovementScaleY = 0.7;
    }
    initializeUI() {
        super.initializeUI();
        const size = this.viewport.getHalfSize();
    }
    /**
     * Load in our resources for level 1
     */
    loadScene() {
        // Load the tongue shader
        super.loadScene();
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level6.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level6.PLAYER_SPRITE_PATH);
        // Load in the enemy sprites
        this.load.spritesheet("Scabbers", "hw4_assets/spritesheets/scabbers2.json");
        this.load.spritesheet("Ultroloth", "hw4_assets/spritesheets/ultroloth.json");
        this.load.spritesheet("Mind Flayer", "hw4_assets/spritesheets/mind_flayer.json");
        this.load.image(this.backgroundKey, AALevel5_1.default.BACKGROUND_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level6.LEVEL_MUSIC_PATH);
        // this.load.audio(this.jumpAudioKey, Level6.JUMP_AUDIO_PATH);
        // this.load.audio(this.attackAudioKey, Level6.ATTACK_AUDIO_PATH);
        // this.load.audio(this.healAudioKey, Level6.HEAL_AUDIO_PATH);
        // this.load.audio(this.explodeAudioKey, Level6.EXPLODE_AUDIO_PATH);
        // this.load.audio(this.grappleAudioKey, Level6.GRAPPLE_AUDIO_PATH);
        // this.load.audio(this.enemyDeathAudioKey, Level6.ENEMY_DEATH_AUDIO_PATH);
        // this.load.audio(this.playerDeathAudioKey, Level6.PLAYER_DEATH_AUDIO_PATH);
        // this.load.image("fireIcon", "hw4_assets/sprites/fire-icon.png");
        // this.load.image("tongueIcon", "hw4_assets/sprites/tongue-icon.png");
        // this.load.image("iceIcon", "hw4_assets/sprites/ice-icon.png");
    }
    /**
     * Unload resources for level 1 - decide what to keep
     */
    unloadScene() {
        this.load.keepSpritesheet(this.playerSpriteKey);
        // this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.attackAudioKey);
        this.load.keepAudio(this.healAudioKey);
        this.load.keepAudio(this.hurtAudioKey);
        this.load.keepAudio(this.explodeAudioKey);
        this.load.keepAudio(this.grappleAudioKey);
        this.load.keepAudio(this.enemyDeathAudioKey);
        this.load.keepAudio(this.playerDeathAudioKey);
        this.load.keepImage("fireIcon");
        this.load.keepImage("tongueIcon");
        this.load.keepImage("iceIcon");
        this.load.keepImage("lockIcon");
    }
    startScene() {
        super.startScene();
        // Set the next level to be END
        // Return to main menu on completion
        this.nextLevel = MainMenu_1.default;
        this.nextLevelNum = 7;
        this.initializeNPCs();
        this.initializeTriggers();
    }
    initializeNPCs() {
        // regular enemies
        const melee = [
            new Vec2_1.default(30, 23).scale(16),
            new Vec2_1.default(44, 23).scale(16),
            new Vec2_1.default(66, 15).scale(16),
            new Vec2_1.default(102, 4).scale(16),
            new Vec2_1.default(66, 44).scale(16),
            new Vec2_1.default(81, 36).scale(16),
            new Vec2_1.default(100, 39).scale(16),
            new Vec2_1.default(120, 39).scale(16),
            new Vec2_1.default(82, 58).scale(16),
            new Vec2_1.default(127, 58).scale(16),
            new Vec2_1.default(35, 75).scale(16),
            new Vec2_1.default(54, 75).scale(16),
            new Vec2_1.default(76, 75).scale(16),
            new Vec2_1.default(110, 75).scale(16),
        ];
        const ranged = [
            new Vec2_1.default(87, 15).scale(16),
            new Vec2_1.default(120, 15).scale(16),
            new Vec2_1.default(9, 48).scale(16),
            new Vec2_1.default(43, 59).scale(16),
            new Vec2_1.default(55, 54).scale(16),
            new Vec2_1.default(92, 39).scale(16),
            new Vec2_1.default(114, 39).scale(16),
            new Vec2_1.default(94, 58).scale(16),
            new Vec2_1.default(105, 58).scale(16),
            new Vec2_1.default(45, 75).scale(16),
            new Vec2_1.default(65, 75).scale(16),
            new Vec2_1.default(87, 75).scale(16),
            new Vec2_1.default(8, 65).scale(16),
            new Vec2_1.default(16, 65).scale(16),
        ];
        melee.forEach((l) => {
            const scabbers = this.add.animatedSprite("Scabbers", AALevel_1.AALayers.PRIMARY);
            scabbers.scale.scale(0.25);
            scabbers.position.set(l.x, l.y);
            scabbers.addPhysics();
            scabbers.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            scabbers.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            scabbers.health = 3;
            scabbers.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, scabbers, AALevel_1.AALayers.PRIMARY, {
                size: scabbers.size.clone().scaled(1.5, 0.25),
                offset: scabbers.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(scabbers.id, healthbar);
            scabbers.animation.play("IDLE");
            scabbers.addAI(ScabberBehavior_1.default, { player: this.player, tilemap: "Collidable" }); // add particles here
            this.allNPCS.set(scabbers.id, scabbers);
            scabbers.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        });
        ranged.forEach((l) => {
            this.rangedEnemyParticleSystem = new RangedEnemyParticles_1.default(1, Vec2_1.default.ZERO, 1000, 3, 10, 1);
            this.rangedEnemyParticleSystem.initializePool(this, AALevel_1.AALayers.PRIMARY);
            const particles = this.rangedEnemyParticleSystem.getPool();
            particles.forEach((particle) => this.allNPCS.set(particle.id, particle));
            const ultroloth = this.add.animatedSprite("Ultroloth", AALevel_1.AALayers.PRIMARY);
            ultroloth.scale.scale(0.25);
            ultroloth.position.set(l.x, l.y);
            ultroloth.addPhysics();
            ultroloth.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICEBALL_HIT_ENEMY, null);
            ultroloth.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_ENEMY, null);
            ultroloth.health = 3;
            ultroloth.maxHealth = 3;
            const healthbar = new HealthbarHUD_1.default(this, ultroloth, AALevel_1.AALayers.PRIMARY, {
                size: ultroloth.size.clone().scaled(1, 0.15),
                offset: ultroloth.size.clone().scaled(0, -1 / 5),
            });
            this.healthbars.set(ultroloth.id, healthbar);
            ultroloth.animation.play("IDLE");
            ultroloth.addAI(RangedEnemyBehavior_1.default, {
                player: this.player,
                particles: this.rangedEnemyParticleSystem,
                tilemap: "Collidable",
            });
            this.allNPCS.set(ultroloth.id, ultroloth);
            ultroloth.tweens.add("DEATH", {
                startDelay: 0,
                duration: 500,
                effects: [
                    {
                        property: "rotation",
                        start: 0,
                        end: Math.PI,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                    {
                        property: "alpha",
                        start: 1,
                        end: 0,
                        ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                    },
                ],
                onEnd: [AAEvents_1.AAEvents.NPC_KILLED],
            });
        });
        // level boss
        this.mindFlayerParticleSystem = new MindFlayerParticles_1.default(50, Vec2_1.default.ZERO, 1000, 3, 10, 50);
        this.mindFlayerParticleSystem.initializePool(this, AALevel_1.AALayers.PRIMARY);
        const particles = this.mindFlayerParticleSystem.getPool();
        particles.forEach((particle) => this.allNPCS.set(particle.id, particle));
        const mindFlayer = this.add.animatedSprite("Mind Flayer", AALevel_1.AALayers.PRIMARY);
        mindFlayer.scale.scale(0.25);
        mindFlayer.position.set(48, 592).mult(this.tilemapScale);
        mindFlayer.addPhysics(undefined, undefined, false, false);
        mindFlayer.setGroup(AAPhysicsGroups_1.AAPhysicsGroups.ENEMY);
        mindFlayer.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.FIREBALL, AAEvents_1.AAEvents.FIREBALL_HIT_ENEMY, null);
        mindFlayer.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.ICE_PARTICLE, AAEvents_1.AAEvents.ICE_HIT_BOSS, null);
        mindFlayer.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.TONGUE, AAEvents_1.AAEvents.TONGUE_HIT_BOSS, null);
        mindFlayer.health = 10;
        mindFlayer.maxHealth = 10;
        mindFlayer.addAI(MindFlayerBehavior_1.default, {
            player: this.player,
            particles: this.mindFlayerParticleSystem,
        });
        this.allNPCS.set(mindFlayer.id, mindFlayer);
        mindFlayer.tweens.add("DEATH", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: Math.PI,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctions_1.EaseFunctionType.IN_OUT_QUAD,
                },
            ],
            onEnd: [AAEvents_1.AAEvents.NPC_KILLED, AAEvents_1.AAEvents.PLAYER_ENTERED_LEVEL_END],
        });
    }
    initializeTriggers() {
        this.bossSpawnTrigger = this.add.graphic(GraphicTypes_1.GraphicType.RECT, AALevel_1.AALayers.PRIMARY, {
            position: this.bossSpawnTriggerPos,
            size: this.bossSpawnTriggerHalfSize,
        });
        this.bossSpawnTrigger.color = Color_1.default.TRANSPARENT;
        this.bossSpawnTrigger.addPhysics(undefined, undefined, false, true);
        this.bossSpawnTrigger.setTrigger(AAPhysicsGroups_1.AAPhysicsGroups.PLAYER, AAEvents_1.AAEvents.SPAWN_BOSS, null);
    }
    updateScene(deltaT) {
        super.updateScene(deltaT);
        // Have to define and update cheatsManager in each individual level
        // to avoid circular dependencies
        this.cheatsManager.update(deltaT);
    }
    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up
     * when I was making the tilemap for the first level is what it boils down to.
     *
     * - Peter
     */
    initializeViewport() {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 2064, 1264);
    }
}
exports.default = Level6;
Level6.PLAYER_SPAWN = new Vec2_1.default(1952, 48);
Level6.PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
Level6.PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Frog.json";
Level6.TILEMAP_KEY = "LEVEL1";
Level6.TILEMAP_PATH = "hw4_assets/tilemaps/AALevel6.json";
Level6.TILEMAP_SCALE = new Vec2_1.default(2, 2);
Level6.COLLIDABLE_LAYER_KEY = "Collidable";
Level6.TONGUE_COLLIDABLE_LAYER_KEY = "TongueCollidable";
Level6.WALLS_LAYER_KEY = "Main";
Level6.LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
Level6.LEVEL_MUSIC_PATH = "hw4_assets/music/dark_level_music.wav";
Level6.BOSS_MUSIC_KEY = "BOSS_MUSIC";
Level6.BOSS_MUSIC_PATH = "hw4_assets/music/dark_level_music_fast.wav";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/Graphics/GraphicTypes":39,"../../Wolfie2D/Utils/Color":97,"../../Wolfie2D/Utils/EaseFunctions":98,"../AAEvents":106,"../AAPhysicsGroups":107,"../AI/NPC/MindFlayerParticles":109,"../AI/NPC/NPCBehaviors/MindFlayerBehavior":114,"../AI/NPC/NPCBehaviors/RangedEnemyBehavior":115,"../AI/NPC/NPCBehaviors/ScabberBehavior":116,"../AI/NPC/RangedEnemyParticles":129,"../CheatsManager":142,"../GameSystems/HUD/HealthbarHUD":146,"./AALevel":150,"./AALevel0":151,"./AALevel5":156,"./MainMenu":161}],158:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLayers = void 0;
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
// Layers for the controls scene
exports.MenuLayers = {
    MAIN: "MAIN",
};
class ControlsScene extends Scene_1.default {
    loadScene() {
        // Load the menu song
        // TODO keep audio from main menu
        //this.load.audio(LevelSelect.MUSIC_KEY, LevelSelect.MUSIC_PATH);
    }
    startScene() {
        this.addUILayer(exports.MenuLayers.MAIN);
        // Center the viewport
        const size = this.viewport.getHalfSize();
        const yOffset = 30;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        // Add logo
        this.gameLogo = this.add.sprite("Logo", exports.MenuLayers.MAIN);
        this.gameLogo.position.set(size.x, size.y - 180); // Set the position of the logo
        this.gameLogo.scale.set(0.25, 0.25);
        // Create title
        // const title = <Label>this.add.uiElement(UIElementType.LABEL, MenuLayers.MAIN, {
        //     position: new Vec2(size.x, size.y - 120),
        //     text: "Amphibious Arcana"
        // });
        // Create controls text
        let i = 1;
        this.createLabel("W - Jump", new Vec2_1.default(size.x, size.y));
        this.createLabel("A - Walk Left", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("D - Walk Right", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("1 - Select Spell 1", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("2 - Select Spell 2", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("3 - Select Spell 3", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("Left Click - Cast Spell", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("Move Mouse - Aim Spell", new Vec2_1.default(size.x, size.y + yOffset * i++));
        this.createLabel("ESC - Pause Game", new Vec2_1.default(size.x, size.y + yOffset * i++));
        // Create a back button
        const backBtn = this.createButton("Back", new Vec2_1.default(size.x, 2 * size.y - 60));
        // When the play button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu_1.default);
        };
        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: ControlsScene.MUSIC_KEY, loop: true, holdReference: true});
    }
    createLabel(text, pos) {
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.MenuLayers.MAIN, {
            position: pos,
            text: text,
            fontSize: 24,
        });
    }
    createButton(text, pos) {
        const btn = (this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.MenuLayers.MAIN, { position: pos, text: text }));
        btn.backgroundColor = Color_1.default.TRANSPARENT;
        btn.borderColor = Color_1.default.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2_1.default(50, 10));
        btn.font = "PixelSimple";
        return btn;
    }
    unloadScene() {
        // The scene is being destroyed, so we can stop playing the song
        // TODO probably only destroy this on level select, and not when going back to main menu
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: ControlsScene.MUSIC_KEY});
    }
}
exports.default = ControlsScene;
ControlsScene.MUSIC_KEY = "MAIN_MENU_MUSIC";
ControlsScene.MUSIC_PATH = "hw4_assets/music/menu.mp3";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Utils/Color":97,"./MainMenu":161}],159:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLayers = void 0;
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
// Layers for the controls scene
exports.MenuLayers = {
    MAIN: "MAIN",
};
class HelpScene extends Scene_1.default {
    loadScene() {
        // Load the menu song
        // TODO keep audio from main menu
        //this.load.audio(LevelSelect.MUSIC_KEY, LevelSelect.MUSIC_PATH);
    }
    startScene() {
        this.addUILayer(exports.MenuLayers.MAIN);
        // Center the viewport
        const size = this.viewport.getHalfSize();
        let sizeY = size.y - 150;
        const yOffset = 20;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        // Create title
        const title = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.MenuLayers.MAIN, {
            position: new Vec2_1.default(size.x, size.y - 200),
            text: "Amphibious Arcana",
        });
        // Create info text
        let i = 1;
        this.createLabel("Developed by Facundo Lopez Camino, Andrew Guo, and Nick Guzzardo", new Vec2_1.default(size.x, sizeY));
        this.createLabel("Wolfie2D created by Joe Weaver and Richard McKenna", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        sizeY += 30;
        this.createLabel(`Gareth the Great is a wizard. He lives in a village full of other wizards.`, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel(`One night, an evil wizard launches a surprise attack on the village.`, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel(`The evil wizard steals the power of all the wizards and turns them into frogs.`, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel(`Gareth is the only one that is still strong enough to travel long distances.`, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel(`He vows to track down the evil wizard and take back the powers of the `, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel(`wizards in his village.`, new Vec2_1.default(size.x, sizeY + yOffset * i++));
        sizeY += 30;
        // Create cheat codes text
        this.createLabel("Cheat Codes", new Vec2_1.default(size.x, sizeY + yOffset * i++), 26);
        sizeY += 15;
        this.createLabel("- Numbers 4-0 to go to levels 0-6 respectively", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel("- Shift to go to boss fight if there is one", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel("- I to enable invincibility", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel("- K to kill the player", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        this.createLabel("- L to unlock all spells", new Vec2_1.default(size.x, sizeY + yOffset * i++));
        // this.createLabel("- P gives you low health", new Vec2(size.x, sizeY + yOffset*i++));
        // this.createLabel("- O enables always full charged spells", new Vec2(size.x, sizeY + yOffset*i++));
        // Create a back button
        const backBtn = this.createButton("Back", new Vec2_1.default(size.x, 2 * size.y - 60));
        // When the play button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu_1.default);
        };
        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: HelpScene.MUSIC_KEY, loop: true, holdReference: true});
    }
    createLabel(text, pos, size) {
        this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.MenuLayers.MAIN, {
            position: pos,
            text: text,
            fontSize: size || 18,
        });
    }
    createButton(text, pos) {
        const btn = (this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.MenuLayers.MAIN, { position: pos, text: text }));
        btn.backgroundColor = Color_1.default.TRANSPARENT;
        btn.borderColor = Color_1.default.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2_1.default(50, 10));
        btn.font = "PixelSimple";
        return btn;
    }
    unloadScene() {
        // The scene is being destroyed, so we can stop playing the song
        // TODO probably only destroy this on level select, and not when going back to main menu
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: HelpScene.MUSIC_KEY});
    }
}
exports.default = HelpScene;
HelpScene.MUSIC_KEY = "MAIN_MENU_MUSIC";
HelpScene.MUSIC_PATH = "hw4_assets/music/menu.mp3";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Utils/Color":97,"./MainMenu":161}],160:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLayers = void 0;
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../Wolfie2D/Events/GameEventType");
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
const AALevel1_1 = __importDefault(require("./AALevel1"));
const AALevel2_1 = __importDefault(require("./AALevel2"));
const AALevel3_1 = __importDefault(require("./AALevel3"));
const AALevel4_1 = __importDefault(require("./AALevel4"));
const AALevel5_1 = __importDefault(require("./AALevel5"));
const AALevel6_1 = __importDefault(require("./AALevel6"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
// Layers for the level select scene
exports.MenuLayers = {
    MAIN: "MAIN",
};
class LevelSelect extends Scene_1.default {
    loadScene() {
        // Load the menu song
        // TODO keep audio from main menu
        //this.load.audio(LevelSelect.MUSIC_KEY, LevelSelect.MUSIC_PATH);
    }
    startScene() {
        this.addUILayer(exports.MenuLayers.MAIN);
        // Center the viewport
        const size = this.viewport.getHalfSize();
        const yOffset = 80;
        const leftColX = size.x - 110;
        const rightColX = size.x + 110;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        // Add logo
        this.gameLogo = this.add.sprite("Logo", exports.MenuLayers.MAIN);
        this.gameLogo.position.set(size.x, size.y - 100); // Set the position of the logo
        this.gameLogo.scale.set(0.25, 0.25);
        // Create a back button
        const backBtn = this.createButton("Back", new Vec2_1.default(size.x, 2 * size.y - 60));
        const yPos = size.y + 100;
        // Create the individual level buttons
        const level0Btn = this.createButton("Level 0", new Vec2_1.default(leftColX - 110, yPos));
        const level1Btn = MainMenu_1.default.LEVEL_COUNTER >= 1
            ? this.createButton("Level 1", new Vec2_1.default(size.x, yPos))
            : this.createButton("Locked", new Vec2_1.default(size.x, yPos));
        const level2Btn = MainMenu_1.default.LEVEL_COUNTER >= 2
            ? this.createButton("Level 2", new Vec2_1.default(rightColX + 110, yPos))
            : this.createButton("Locked", new Vec2_1.default(rightColX + 110, yPos));
        const level3Btn = MainMenu_1.default.LEVEL_COUNTER >= 3
            ? this.createButton("Level 3", new Vec2_1.default(leftColX, yPos + yOffset))
            : this.createButton("Locked", new Vec2_1.default(leftColX, yPos + yOffset));
        const level4Btn = MainMenu_1.default.LEVEL_COUNTER >= 4
            ? this.createButton("Level 4", new Vec2_1.default(rightColX, yPos + yOffset))
            : this.createButton("Locked", new Vec2_1.default(rightColX, yPos + yOffset));
        const level5Btn = MainMenu_1.default.LEVEL_COUNTER >= 5
            ? this.createButton("Level 5", new Vec2_1.default(leftColX, yPos + yOffset * 2))
            : this.createButton("Locked", new Vec2_1.default(leftColX, yPos + yOffset * 2));
        const level6Btn = MainMenu_1.default.LEVEL_COUNTER >= 6
            ? this.createButton("Level 6", new Vec2_1.default(rightColX, yPos + yOffset * 2))
            : this.createButton("Locked", new Vec2_1.default(rightColX, yPos + yOffset * 2));
        // When the play button is clicked, go to the next scene
        backBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu_1.default);
        };
        level0Btn.onClick = () => {
            // TODO
            MainMenu_1.default.GAME_PLAYING = true;
            MainMenu_1.default.CURRENT_LEVEL = 0;
            this.sceneManager.changeToScene(AALevel0_1.default);
        };
        level1Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 1) {
                MainMenu_1.default.GAME_PLAYING = true;
                MainMenu_1.default.CURRENT_LEVEL = 1;
                this.sceneManager.changeToScene(AALevel1_1.default);
            }
        };
        level2Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 2) {
                MainMenu_1.default.GAME_PLAYING = true;
                MainMenu_1.default.CURRENT_LEVEL = 2;
                this.sceneManager.changeToScene(AALevel2_1.default);
            }
        };
        level3Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 3) {
                MainMenu_1.default.CURRENT_LEVEL = 3;
                MainMenu_1.default.GAME_PLAYING = true;
                this.sceneManager.changeToScene(AALevel3_1.default);
            }
        };
        level4Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 4) {
                MainMenu_1.default.CURRENT_LEVEL = 4;
                MainMenu_1.default.GAME_PLAYING = true;
                this.sceneManager.changeToScene(AALevel4_1.default);
            }
        };
        level5Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 5) {
                MainMenu_1.default.CURRENT_LEVEL = 5;
                MainMenu_1.default.GAME_PLAYING = true;
                this.sceneManager.changeToScene(AALevel5_1.default);
            }
        };
        level6Btn.onClick = () => {
            // TODO
            if (MainMenu_1.default.LEVEL_COUNTER >= 6) {
                MainMenu_1.default.CURRENT_LEVEL = 6;
                MainMenu_1.default.GAME_PLAYING = true;
                this.sceneManager.changeToScene(AALevel6_1.default);
            }
        };
        // Scene has started, so start playing music
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: LevelSelect.MUSIC_KEY, loop: true, holdReference: true});
    }
    createButton(text, pos) {
        const btn = (this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.MenuLayers.MAIN, { position: pos, text: text }));
        btn.backgroundColor = Color_1.default.TRANSPARENT;
        btn.borderColor = Color_1.default.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2_1.default(50, 10));
        btn.font = "PixelSimple";
        return btn;
    }
    unloadScene() {
        // The scene is being destroyed, so we can stop playing the song
        // TODO probably only destroy this on level select, and not when going back to main menu
        if (MainMenu_1.default.GAME_PLAYING) {
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: LevelSelect.MUSIC_KEY });
        }
    }
}
exports.default = LevelSelect;
LevelSelect.MUSIC_KEY = "MAIN_MENU_MUSIC";
LevelSelect.MUSIC_PATH = "hw4_assets/music/menu.mp3";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/GameEventType":27,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Utils/Color":97,"./AALevel0":151,"./AALevel1":152,"./AALevel2":153,"./AALevel3":154,"./AALevel4":155,"./AALevel5":156,"./AALevel6":157,"./MainMenu":161}],161:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLayers = void 0;
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../Wolfie2D/Events/GameEventType");
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const LevelSelect_1 = __importDefault(require("./LevelSelect"));
const ControlsScene_1 = __importDefault(require("./ControlsScene"));
const HelpScene_1 = __importDefault(require("./HelpScene"));
const AALevel0_1 = __importDefault(require("./AALevel0"));
// Layers for the main menu scene
exports.MenuLayers = {
    MAIN: "MAIN",
};
class MainMenu extends Scene_1.default {
    loadScene() {
        // Load the menu song
        //this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);
    }
    startScene() {
        this.addUILayer(exports.MenuLayers.MAIN);
        // Center the viewport
        let size = this.viewport.getHalfSize();
        let yOffset = 80;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        let yPos = size.y + 100;
        // Add logo
        this.gameLogo = this.add.sprite("Logo", exports.MenuLayers.MAIN);
        this.gameLogo.position.set(size.x, size.y - 100); // Set the position of the logo
        this.gameLogo.scale.set(0.25, 0.25);
        // Create a play button
        let playBtn = this.createButton("Play Game", new Vec2_1.default(size.x, yPos));
        // Create level select button
        let levelSelectBtn = this.createButton("Level Select", new Vec2_1.default(size.x, yPos + yOffset));
        // Create controls button
        let controlsBtn = this.createButton("Controls", new Vec2_1.default(size.x, yPos + yOffset * 2));
        // Create help button
        let helpBtn = this.createButton("Help", new Vec2_1.default(size.x, yPos + yOffset * 3));
        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            MainMenu.GAME_PLAYING = true;
            MainMenu.CURRENT_LEVEL = 0;
            this.sceneManager.changeToScene(AALevel0_1.default);
        };
        levelSelectBtn.onClick = () => {
            this.sceneManager.changeToScene(LevelSelect_1.default);
        };
        controlsBtn.onClick = () => {
            this.sceneManager.changeToScene(ControlsScene_1.default);
        };
        helpBtn.onClick = () => {
            this.sceneManager.changeToScene(HelpScene_1.default);
        };
        // Scene has started, so start playing music
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }
    createButton(text, pos) {
        let btn = (this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.MenuLayers.MAIN, { position: pos, text: text }));
        btn.backgroundColor = Color_1.default.TRANSPARENT;
        btn.borderColor = Color_1.default.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2_1.default(50, 10));
        btn.font = "PixelSimple";
        return btn;
    }
    unloadScene() {
        // The scene is being destroyed, so we can stop playing the song
        this.load.keepAudio(MainMenu.MUSIC_KEY);
        if (MainMenu.GAME_PLAYING) {
            this.emitter.fireEvent(GameEventType_1.GameEventType.STOP_SOUND, { key: MainMenu.MUSIC_KEY });
        }
    }
}
exports.default = MainMenu;
MainMenu.MUSIC_KEY = "MAIN_MENU_MUSIC";
MainMenu.MUSIC_PATH = "hw4_assets/music/menu_concept.wav";
MainMenu.LEVEL_COUNTER = 0;
// if not current level then boss flag
MainMenu.CURRENT_LEVEL = 0;
MainMenu.GAME_PLAYING = false;
MainMenu.BOSS_LOCATION = null;
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/GameEventType":27,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Utils/Color":97,"./AALevel0":151,"./ControlsScene":158,"./HelpScene":159,"./LevelSelect":160}],162:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLayers = void 0;
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const GameEventType_1 = require("../../Wolfie2D/Events/GameEventType");
const UIElementTypes_1 = require("../../Wolfie2D/Nodes/UIElements/UIElementTypes");
const Scene_1 = __importDefault(require("../../Wolfie2D/Scene/Scene"));
const Color_1 = __importDefault(require("../../Wolfie2D/Utils/Color"));
const MainMenu_1 = __importDefault(require("./MainMenu"));
// Layers for the main menu scene
exports.MenuLayers = {
    MAIN: "MAIN"
};
class SplashSceen extends Scene_1.default {
    loadScene() {
        // Load the menu song
        this.load.audio(SplashSceen.MUSIC_KEY, SplashSceen.MUSIC_PATH);
        this.load.image('Logo', 'hw4_assets/images/Logo.png');
    }
    startScene() {
        this.addUILayer(exports.MenuLayers.MAIN);
        // Center the viewport
        let size = this.viewport.getHalfSize();
        let yOffset = 80;
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        // Create title
        let prompt = this.add.uiElement(UIElementTypes_1.UIElementType.LABEL, exports.MenuLayers.MAIN, {
            position: new Vec2_1.default(size.x, size.y + 200),
            text: "Click Anywhere to Start!"
        });
        // Create a play button
        let playBtn = this.createButton("Play Game", new Vec2_1.default(size.x, size.y));
        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu_1.default);
        };
        // Add logo
        this.gameLogo = this.add.sprite("Logo", exports.MenuLayers.MAIN);
        this.gameLogo.position.set(size.x, size.y - 100); // Set the position of the logo
        this.gameLogo.scale.set(.25, .25);
        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType_1.GameEventType.PLAY_SOUND, { key: SplashSceen.MUSIC_KEY, loop: true, holdReference: true });
    }
    createButton(text, pos) {
        let size = this.viewport.getHalfSize();
        let btn = this.add.uiElement(UIElementTypes_1.UIElementType.BUTTON, exports.MenuLayers.MAIN, { position: pos, text: text });
        btn.backgroundColor = Color_1.default.TRANSPARENT;
        btn.borderColor = Color_1.default.WHITE;
        btn.borderRadius = 0;
        btn.setPadding(new Vec2_1.default(size.x, size.y));
        btn.font = "PixelSimple";
        return btn;
    }
    unloadScene() {
        // The scene is being destroyed, so we can stop playing the song
        this.load.keepAudio(SplashSceen.MUSIC_KEY);
        this.load.keepImage('Logo');
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: SplashSceen.MUSIC_KEY});
    }
}
exports.default = SplashSceen;
SplashSceen.MUSIC_KEY = "MAIN_MENU_MUSIC";
SplashSceen.MUSIC_PATH = "hw4_assets/music/menu_concept.wav";
},{"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Events/GameEventType":27,"../../Wolfie2D/Nodes/UIElements/UIElementTypes":53,"../../Wolfie2D/Scene/Scene":91,"../../Wolfie2D/Utils/Color":97,"./MainMenu":161}],163:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mat4x4_1 = __importDefault(require("../../Wolfie2D/DataTypes/Mat4x4"));
const Vec2_1 = __importDefault(require("../../Wolfie2D/DataTypes/Vec2"));
const RectShaderType_1 = __importDefault(require("../../Wolfie2D/Rendering/WebGLRendering/ShaderTypes/RectShaderType"));
class TongueShaderType extends RectShaderType_1.default {
    initBufferObject() {
        this.bufferObjectKey = TongueShaderType.KEY;
        this.resourceManager.createBuffer(this.bufferObjectKey);
    }
    render(gl, options) {
        // Get our program and buffer object
        const program = this.resourceManager.getShaderProgram(this.programKey);
        const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);
        // Let WebGL know we're using our shader program
        gl.useProgram(program);
        // Get our vertex data
        const vertexData = this.getVertices(options.size.x, options.size.y);
        const FSIZE = vertexData.BYTES_PER_ELEMENT;
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
        /* ##### ATTRIBUTES ##### */
        // No texture, the only thing we care about is vertex position
        const a_Position = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
        gl.enableVertexAttribArray(a_Position);
        /* ##### UNIFORMS ##### */
        const u_Color = gl.getUniformLocation(program, "u_Color");
        gl.uniform4fv(u_Color, options.color.toWebGL());
        // Get transformation matrix
        // We have a square for our rendering space, so get the maximum dimension of our quad
        let maxDimension = Math.max(options.size.x, options.size.y);
        // The size of the rendering space will be a square with this maximum dimension
        let size = new Vec2_1.default(maxDimension, maxDimension).scale(2 / options.worldSize.x, 2 / options.worldSize.y);
        // Center our translations around (0, 0)
        const translateX = (options.position.x - options.origin.x - options.worldSize.x / 2) / maxDimension;
        const translateY = -(options.position.y - options.origin.y - options.worldSize.y / 2) / maxDimension;
        // Create our transformation matrix
        this.translation.translate(new Float32Array([translateX, translateY]));
        this.scale.scale(size);
        this.rotation.rotate(options.rotation);
        let transformation = Mat4x4_1.default.MULT(this.translation, this.scale, this.rotation);
        // Pass the translation matrix to our shader
        const u_Transform = gl.getUniformLocation(program, "u_Transform");
        gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());
        // Draw the quad
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    getOptions(gc) {
        let options = {
            position: gc.position,
            size: gc.size,
            color: gc.color,
            rotation: gc.rotation,
        };
        return options;
    }
}
exports.default = TongueShaderType;
/** This is the key of the shader program for the TongueShaderType */
TongueShaderType.KEY = "TONGUE_SHADER_TYPE_KEY";
/** This is the path to the vertex shader for the TongueShaderType */
TongueShaderType.VSHADER = "./hw3_assets/shaders/tongue.vshader";
/** This is the path to the fragment shader for the TongueShaderType */
TongueShaderType.FSHADER = "./hw3_assets/shaders/tongue.fshader";
},{"../../Wolfie2D/DataTypes/Mat4x4":9,"../../Wolfie2D/DataTypes/Vec2":21,"../../Wolfie2D/Rendering/WebGLRendering/ShaderTypes/RectShaderType":79}],164:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("./Wolfie2D/Loop/Game"));
const AAControls_1 = require("./aa/AAControls");
const SplashScreen_1 = __importDefault(require("./aa/Scenes/SplashScreen"));
// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main() {
    // Set up options for our game
    const options = {
        canvasSize: { x: 1200, y: 800 },
        // canvasSize: {x: window.innerWidth, y: window.innerHeight},
        clearColor: { r: 12, g: 14, b: 37 },
        inputs: [
            { name: AAControls_1.AAControls.MOVE_LEFT, keys: ["a"] },
            { name: AAControls_1.AAControls.MOVE_RIGHT, keys: ["d"] },
            { name: AAControls_1.AAControls.JUMP, keys: ["w", "space"] },
            // { name: AAControls.ATTACK, keys: ["x"] },
            { name: AAControls_1.AAControls.SELECT_TONGUE, keys: ["1"] },
            { name: AAControls_1.AAControls.SELECT_FIREBALL, keys: ["2"] },
            { name: AAControls_1.AAControls.SELECT_ICE, keys: ["3"] },
            { name: AAControls_1.AAControls.PAUSE, keys: ["escape"] },
            { name: AAControls_1.AAControls.GOTO_BOSS, keys: ["shift"] },
            { name: AAControls_1.AAControls.TOGGLE_INVINCIBILITY, keys: ["i"] },
            { name: AAControls_1.AAControls.PLAYER_KILL, keys: ["k"] },
            { name: AAControls_1.AAControls.UNLOCK_SPELLS, keys: ["l"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_0, keys: ["4"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_1, keys: ["5"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_2, keys: ["6"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_3, keys: ["7"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_4, keys: ["8"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_5, keys: ["9"] },
            { name: AAControls_1.AAControls.GOTO_LEVEL_6, keys: ["0"] },
        ],
        useWebGL: false,
        showDebug: false, // Whether to show debug messages. You can change this to true if you want
    };
    // Create a game with the options specified
    const game = new Game_1.default(options);
    // Start our game
    game.start(SplashScreen_1.default, {});
})();
},{"./Wolfie2D/Loop/Game":33,"./aa/AAControls":105,"./aa/Scenes/SplashScreen":162}]},{},[164])