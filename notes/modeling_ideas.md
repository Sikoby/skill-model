# Random Idea Collection

## Skill graph

Nodes:
Different skills

Edges: Relations between skills

- requires (prerequisite)
- related_to (lateral similarity)
- specialization_of (hierarchical)

### Visualization

```mermaid
graph TB
  subgraph languages["Programming languages"]
    Python
    R
    JavaScript
    SQL
  end

  subgraph job_titles["Job titles"]
    Data_Scientist["Data Scientist"]
    ML_Engineer["ML Engineer"]
    Software_Engineer["Software Engineer"]
    Analyst["Data Analyst"]
  end

  subgraph python_packages["Python packages & frameworks"]
    pandas
    numpy
    scikit_learn["scikit-learn"]
    TensorFlow
    PyTorch
    matplotlib
  end

  subgraph domains["Domains & tools"]
    Statistics
    Machine_Learning["Machine Learning"]
    Deep_Learning["Deep Learning"]
    Git
    Docker
  end

  %% requires (prerequisite)
  pandas -->|requires| Python
  numpy -->|requires| Python
  scikit_learn -->|requires| Python
  TensorFlow -->|requires| Python
  PyTorch -->|requires| Python
  matplotlib -->|requires| Python
  Data_Scientist -->|requires| Python
  Data_Scientist -->|requires| Statistics
  ML_Engineer -->|requires| Machine_Learning
  Machine_Learning -->|requires| Statistics
  Deep_Learning -->|requires| Machine_Learning
  scikit_learn -->|requires| Machine_Learning
  TensorFlow -->|requires| Deep_Learning
  PyTorch -->|requires| Deep_Learning
  Analyst -->|requires| SQL
  Software_Engineer -->|requires| Git

  %% specialization_of (hierarchical)
  ML_Engineer -->|specialization_of| Data_Scientist
  Analyst -->|specialization_of| Data_Scientist
  Deep_Learning -->|specialization_of| Machine_Learning

  %% related_to (lateral)
  numpy ---|related_to| pandas
  PyTorch ---|related_to| TensorFlow
  R ---|related_to| Python
  JavaScript ---|related_to| Python
  Docker ---|related_to| Git
```



### Skill proximity

Edges can have weights. These can help to deal with uncomplete Data. E.g. you have mentioned the skill "Machine Learning". This requires "stats", thus based on the weight you also have partially the skill "stats".

#### Rules for distribution in the graph

Each node has a skill level 0 to 1

Up: all higher level skill plus domain  
Down: To reach 1 you need to know the skill and score 1 in every spezilisation, i.e. b + sum kids



## AI Replaceabity

### Level of skill

I belive we have to model the level of a skill to some extend to capture relaistic dynamics. A basic Software engineer might be easilly replaceable while a well skilled one is not.

This can be captured by

- A: Different skills (easier)
- B: Level of proficancy of one skill (harder to model)

