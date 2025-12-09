# Framework-JogoFinal

## O jogo possui três níveis de dificuldade, cada um com mais inimigos e velocidades maiores:

    Easy (Fácil)
    
    5 inimigos
    
    Velocidade baixa (1–3)
    
    Medium (Médio)
    
    13 inimigos
    
    Velocidade moderada (2–5)
    
    Hard (Difícil)
    
    20 inimigos

Velocidade alta (3–7)

## Como alterar a dificuldade

A dificuldade é escolhida diretamente no HTML, no atributo mode do canvas.

Exemplo no HTML:

        <canvas id="GameCanvas" mode="Hard"></canvas>
        <canvas id="GameCanvas" mode="Easy"></canvas> 
        <canvas id="GameCanvas" mode="Medium"></canvas> 


## Como criar uma nova fase

Se quiser inventar uma fase nova:
    Basta editar esta parte no arquivo funcoes.js:

        getDifficultySettings(mode) {
        const modes = {
            Easy:   { enemyCount: 5,  enemySpeedMin: 1, enemySpeedMax: 3 },
            Medium: { enemyCount: 13, enemySpeedMin: 2, enemySpeedMax: 5 },
            Hard:   { enemyCount: 20, enemySpeedMin: 3, enemySpeedMax: 7 }
        };
    
        return modes[mode] || modes.Easy;
        } 

Adicionando um novo modo:
    
        Insane: { enemyCount: 40, enemySpeedMin: 5, enemySpeedMax: 12 } 
