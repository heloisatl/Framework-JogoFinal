# Framework-JogoFinal

## Funcionalidades Principais

O jogador é um quadrado que se move com as setas do teclado.
A posição, tamanho e cor (x->posição horizontal y->posição vertical size->tamanho e cor) podem ser definidos no próprio HTML:
        
        <player x="200" y="200" size="40" cor="blue"></player>   
        
Cada inimigo é uma bola com direção e velocidade própria.
Eles quicam nas paredes e também nos obstáculos do mapa.

    <enemy x="50" y="60" raio="25" dx="2" dy="3"></enemy>
    
Você pode criar quantos obstáculos quiser com:

    <obstaculo x="0" y="10" largura="200" altura="20" cor="black"></obstaculo>

##Dificuldade do jogo:
Pode ser alterada com a tag config, como mostrado abaixo:

    <config dificuldade="Hard"></config>
Temos a dificuldade Easy, Medium e Hard. Se deixar vazio ou colocar algo inválido, o modo Easy é aplicado automaticamente.
