---
title: "Neural Networks Explained: A Beginner's Mental Model"
description: "How I finally understood neural networks by thinking of them like a restaurant kitchen brigade."
date: "2024-01-22"
tags: ["Machine Learning", "Neural Networks", "Beginner"]
---

# Neural Networks: The Restaurant Kitchen of AI

When I first tried to understand neural networks, I was completely lost. Perceptrons? Activation functions? Backpropagation? It all sounded like gibberish.

Then I found a mental model that clicked: **neural networks are like a restaurant kitchen brigade**.

## The Kitchen Brigade Analogy

In a professional kitchen, you have a hierarchy:

1. **Commis chefs** (entry-level) - handle basic prep work
2. **Chef de partie** (station chefs) - specialize in specific areas
3. **Sous chef** - coordinates everything
4. **Executive chef** - makes final decisions on dishes

This is remarkably similar to how neural networks work!

## Input Layer = Raw Ingredients

Just like raw ingredients come into the kitchen, data comes into the neural network through the **input layer**. Each neuron in this layer represents one feature of your data.

```
Raw image pixels → [0.2, 0.8, 0.1, 0.5, ...]
```

## Hidden Layers = Kitchen Stations

The **hidden layers** are like different kitchen stations, each processing the data in specific ways:

- The first hidden layer might identify basic patterns (edges in an image)
- Deeper layers combine these into more complex patterns (shapes, then objects)

Just like how:
- Prep station: chops vegetables (basic processing)
- Sauté station: combines prepped ingredients (intermediate processing)
- Plating station: brings everything together (final processing)

## Weights = Recipe Proportions

The **weights** in a neural network are like recipe proportions. How much of each ingredient do you need?

```python
# Simplified example
output = (input1 * weight1) + (input2 * weight2) + bias
```

A good chef knows exactly how much salt to add. Similarly, a trained neural network has learned the right weights.

## Activation Functions = The Chef's Decision

After combining inputs with weights, we apply an **activation function**. This is like a chef deciding: "Does this taste good enough to pass on?"

The most common one, ReLU (Rectified Linear Unit), is simple:
- If the value is negative → output 0 (reject it)
- If the value is positive → pass it through (accept it)

```python
def relu(x):
    return max(0, x)
```

## Backpropagation = Feedback from Customers

Here's where it gets interesting. **Backpropagation** is like customer feedback flowing back to the kitchen:

1. Customer says the dish is too salty
2. Feedback goes to the plating station
3. Then back to the sauté station
4. Eventually reaching prep, where they adjust the initial seasoning

In neural networks:
1. We calculate the error (how wrong was our prediction?)
2. We trace back through the network
3. We adjust weights to reduce the error

## Putting It All Together

A forward pass through a neural network:

```
Input data
    ↓
[Input Layer] - receives features
    ↓
[Hidden Layer 1] - basic pattern detection
    ↓
[Hidden Layer 2] - complex pattern detection
    ↓
[Output Layer] - final prediction
```

## What Clicked for Me

Understanding that neural networks are essentially:
1. **Taking inputs**
2. **Multiplying by learned weights**
3. **Adding them up**
4. **Applying a decision function**
5. **Passing to the next layer**

Made everything feel less magical and more mechanical. It's just math, repeated many times.

## Resources That Helped

- 3Blue1Brown's neural network video series (visual and intuitive)
- The book "Neural Networks from Scratch" (builds everything in plain Python)
- Actually implementing a simple network by hand

---

*Next up: I'll try to build a neural network from scratch in Python. Wish me luck!*
