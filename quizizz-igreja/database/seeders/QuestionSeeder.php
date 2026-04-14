<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'level' => 1,
                'title' => 'Qual é a cor litúrgica usada no Advento e na Quaresma?',
                'option_a' => 'Verde', 'option_b' => 'Branco', 'option_c' => 'Roxo', 'option_d' => 'Vermelho',
                'correct_option' => 'c',
                'hint' => 'É uma cor que convida à penitência e preparação.',
                'explanation' => 'O Roxo simboliza a expectativa e a penitência.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o objeto usado para queimar o incenso?',
                'option_a' => 'Cálice', 'option_b' => 'Turíbulo', 'option_c' => 'Patena', 'option_d' => 'Galheta',
                'correct_option' => 'b',
                'hint' => 'Ele é balançado pelo acólito e solta fumaça perfumada.',
                'explanation' => 'O Turíbulo é o vaso onde se queima o incenso sobre brasas.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Qual o nome do prato dourado onde é colocada a hóstia grande?',
                'option_a' => 'Âmbula', 'option_b' => 'Cálice', 'option_c' => 'Patena', 'option_d' => 'Corporal',
                'correct_option' => 'c',
                'hint' => 'É um prato pequeno e raso que acompanha o cálice.',
                'explanation' => 'A Patena é o prato onde se coloca a hóstia que será consagrada.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o pequeno sino usado na consagração?',
                'option_a' => 'Matraca', 'option_b' => 'Sineta', 'option_c' => 'Carrilhão', 'option_d' => 'Gongo',
                'correct_option' => 'b',
                'hint' => 'É tocada pelo acólito para chamar a atenção para o milagre da Eucaristia.',
                'explanation' => 'A Sineta é usada para anunciar os momentos solenes da consagração.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Quais são os pequenos vasos que contêm a água e o vinho?',
                'option_a' => 'Âmulas', 'option_b' => 'Cálices', 'option_c' => 'Galhetas', 'option_d' => 'Patenas',
                'correct_option' => 'c',
                'hint' => 'Ficam sobre a credência antes do ofertório.',
                'explanation' => 'As Galhetas são os dois recipientes para a água e o vinho do sacrifício.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o pano branco usado para limpar o cálice?',
                'option_a' => 'Corporal', 'option_b' => 'Sanguíneo', 'option_c' => 'Manustérgio', 'option_d' => 'Pala',
                'correct_option' => 'b',
                'hint' => 'O nome lembra o "Sangue" de Cristo que é limpo do cálice.',
                'explanation' => 'O Sanguíneo é o pano retangular usado para purificar o cálice.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Qual o nome do livro que contém as orações da Missa?',
                'option_a' => 'Lecionário', 'option_b' => 'Bíblia', 'option_c' => 'Missal Romano', 'option_d' => 'Evangeliário',
                'correct_option' => 'c',
                'hint' => 'O acólito o segura para o padre na oração da coleta.',
                'explanation' => 'O Missal contém as orações presidenciais e o rito da Missa.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Como se chama a veste branca que o acólito usa por baixo?',
                'option_a' => 'Batina', 'option_b' => 'Sobrepeliz', 'option_c' => 'Alva ou Túnica', 'option_d' => 'Estola',
                'correct_option' => 'c',
                'hint' => 'Simboliza a pureza do batismo.',
                'explanation' => 'A Alva ou Túnica é a veste básica de todos os ministros.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Qual objeto é usado para aspergir água benta nos fiéis?',
                'option_a' => 'Naveta', 'option_b' => 'Aspersório', 'option_c' => 'Caldeirinha', 'option_d' => 'Custódia',
                'correct_option' => 'b',
                'hint' => 'Parece um "bastão" com furos na ponta.',
                'explanation' => 'O Aspersório é usado junto com a caldeirinha para a aspersão.',
                'base_points' => 10
            ],
            [
                'level' => 1,
                'title' => 'Como se chama o lugar onde ficam os objetos litúrgicos?',
                'option_a' => 'Altar', 'option_b' => 'Ambão', 'option_c' => 'Credência', 'option_d' => 'Sacristia',
                'correct_option' => 'c',
                'hint' => 'É uma mesa pequena lateral ao altar.',
                'explanation' => 'A Credência é a mesa onde se preparam os vasos sagrados.',
                'base_points' => 10
            ],
        ];

        foreach ($questions as $q) {
            Question::create($q);
        }
    }
}
