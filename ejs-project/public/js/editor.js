const DEFAULT_CODE = {
  cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

#define INF INT_MAX

void dijkstra(vector<vector<pair<int, int>>> &graph, int source) {
  int V = graph.size();
  vector<int> dist(V, INF);
  priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
  dist[source] = 0;
  pq.push({0, source});

  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();

    for (auto &neighbor : graph[u]) {
      int v = neighbor.first;
      int weight = neighbor.second;

      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.push({dist[v], v});
      }
    }
  }

  cout << "Shortest distances from source " << source << ":" << endl;
  for (int i = 0; i < V; ++i)
    cout << "Vertex " << i << ": " << dist[i] << endl;
}

int main() {
  int V = 5;
  vector<vector<pair<int, int>>> graph(V);

  graph[0].push_back({1, 2});
  graph[0].push_back({2, 4});
  graph[1].push_back({2, 1});
  graph[1].push_back({3, 7});
  graph[2].push_back({3, 3});
  graph[3].push_back({4, 1});

  dijkstra(graph, 0);

  return 0;
}`
};

const codeInput = document.getElementById('codeInput');
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const outputText = document.getElementById('outputText');
const outputPlaceholder = document.getElementById('outputPlaceholder');

// Set default code
codeInput.value = DEFAULT_CODE.cpp;

function showOutput(text) {
  outputText.textContent = text;
  outputText.style.display = 'block';
  outputPlaceholder.style.display = 'none';
  clearBtn.style.display = 'inline-flex';
}

function hideOutput() {
  outputText.style.display = 'none';
  outputPlaceholder.style.display = 'flex';
  clearBtn.style.display = 'none';
}

clearBtn.addEventListener('click', hideOutput);

runBtn.addEventListener('click', async () => {
  const selectedLanguage = document.getElementById('language').value;
  const code = codeInput.value;

  runBtn.disabled = true;
  runBtn.classList.add('loading');
  runBtn.innerHTML = `<div class="spinner"></div> Running...`;

  try {
    const response = await fetch(
      `https://dijkstra-visualizer-10.onrender.com/api/${selectedLanguage}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }
    );

    if (!response.ok) throw new Error('Network response was not ok');

    const result = await response.json();
    showOutput(result.status === 'success' ? result.stdout : (result.stderr || result.message));
  } catch (error) {
    showOutput('Error executing code. Please check console for details.');
    console.error('Error:', error);
  } finally {
    runBtn.disabled = false;
    runBtn.classList.remove('loading');
    runBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <polygon points="5,3 19,12 5,21" fill="currentColor"/>
      </svg>
      Run Code`;
  }
});
